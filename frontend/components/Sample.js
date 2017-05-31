import React from 'react'
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

const SignaledSample = signalRender(sampleRenderSignal)(Sample)

export default SignaledSample
