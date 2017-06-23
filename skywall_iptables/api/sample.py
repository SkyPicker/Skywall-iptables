from aiohttp.web import json_response
from skywall.core.database import create_session
from skywall.core.signals import Signal
from skywall.core.api import register_api
from skywall_iptables.models.sample import Sample, before_sample_create, after_sample_create


before_get_sample = Signal('before_get_sample')
after_get_sample = Signal('before_get_sample')


@register_api('GET', '/sample', before_get_sample, after_get_sample)
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
        before_sample_create.emit(session=session, sample=sample)
        session.add(sample)
        session.flush()
        after_sample_create.emit(session=session, sample=sample)
        return json_response({'message': 'Sample response'})
