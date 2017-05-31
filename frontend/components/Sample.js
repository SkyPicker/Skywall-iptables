import React from 'react'
import {compose} from 'redux'
import signalRender from 'skywall/frontend/hocs/signalRender'
import {sampleRenderSignal} from '../signals'


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

export default compose(
  signalRender(sampleRenderSignal),
)(Sample)
