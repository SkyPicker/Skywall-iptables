import React from 'react'
import {compose} from 'redux'
import signalRender from 'skywall/frontend/hocs/signalRender'
import {RenderSignal} from 'skywall/frontend/utils/signals'


class Sample extends React.Component {

  static propTypes = {
  }

  render() {
    return (
      <div>
        <p>Sample</p>
      </div>
    )
  }
}

export const sampleRenderSignal = new RenderSignal('sampleRenderSignal')

export default compose(
  signalRender(sampleRenderSignal),
)(Sample)
