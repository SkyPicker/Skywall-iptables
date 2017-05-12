from aiohttp.web import json_response
from skywall.core.database import create_session
from skywall.core.api import register_api
from skywall_iptables.models.sample import Sample


@register_api('GET', '/sample')
async def get_sample(request):
    """
    ---
    tags:
      - Sample
    summary: Sample API
    description: Sample Skywall module API endpoint
    produces:
      - application/json
    responses:
      200:
        description: Sample response
        schema:
          type: object
          title: GetSample
          required:
            - message
          properties:
            message:
              type: string
    """
    with create_session() as session:
        sample = Sample(value='Sample value')
        session.add(sample)
        return json_response({'message': 'Sample response'})
