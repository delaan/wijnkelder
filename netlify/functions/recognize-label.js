const { requireUser } = require('./_supabaseUser')

// Model bewust vastgepind op een gedateerde ID (i.p.v. een alias) zoals
// Anthropic voor productiegebruik aanraadt, en gekozen op prijs/snelheid:
// etiketgegevens herkennen is een relatief eenvoudige, gestructureerde taak.
const MODEL = 'claude-haiku-4-5-20251001'

const EXTRACT_TOOL = {
  name: 'extract_wine_label',
  description: 'Leg de gegevens vast die van het wijnetiket op de foto zijn af te lezen.',
  input_schema: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: 'Naam van de wijn/cuvée, zonder de naam van de producent en zonder jaargang.',
      },
      producer: { type: 'string', description: 'Naam van het wijnhuis, domein of producent.' },
      vintage: {
        type: 'integer',
        description: 'Jaargang als 4-cijferig jaartal. Laat dit veld helemaal weg als er geen jaargang op het etiket staat.',
      },
      region: { type: 'string', description: 'Wijnregio of streek.' },
      country: { type: 'string', description: 'Land van herkomst.' },
      appellation: { type: 'string', description: 'Bijv. een AOC/DOC/DOCG-aanduiding, indien aanwezig.' },
      classification: { type: 'string', description: 'Bijv. Grand Cru, Reserva, Premier Cru, indien aanwezig.' },
      grape_varieties: { type: 'string', description: 'Druivensoort(en), kommagescheiden indien er meerdere zijn.' },
      color: {
        type: 'string',
        enum: ['rood', 'wit', 'rose', 'mousserend', 'dessert', 'versterkt'],
        description: 'Beste inschatting van het wijntype op basis van het etiket.',
      },
    },
    required: ['name', 'color'],
  },
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) }
  }
  const auth = await requireUser(event)
  if (auth.error) return { statusCode: auth.status, body: JSON.stringify({ error: auth.error }) }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'AI-herkenning is nog niet ingesteld (ANTHROPIC_API_KEY ontbreekt).' }),
    }
  }

  let image, mediaType
  try {
    ;({ image, mediaType } = JSON.parse(event.body || '{}'))
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Ongeldige aanvraag.' }) }
  }
  if (!image) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Geen foto meegestuurd.' }) }
  }

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1024,
        tools: [EXTRACT_TOOL],
        tool_choice: { type: 'tool', name: 'extract_wine_label' },
        messages: [
          {
            role: 'user',
            content: [
              { type: 'image', source: { type: 'base64', media_type: mediaType || 'image/jpeg', data: image } },
              { type: 'text', text: 'Herken de gegevens van dit wijnetiket en vul het extract_wine_label-tool in.' },
            ],
          },
        ],
      }),
    })

    const data = await res.json()
    if (!res.ok) {
      throw new Error(data?.error?.message || 'Anthropic API-aanvraag mislukt.')
    }

    const toolUse = (data.content || []).find((block) => block.type === 'tool_use')
    if (!toolUse) {
      return { statusCode: 422, body: JSON.stringify({ error: 'Kon geen gegevens herkennen op deze foto.' }) }
    }

    return { statusCode: 200, body: JSON.stringify(toolUse.input) }
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message || 'Herkenning mislukt.' }) }
  }
}
