import React from 'react'
import {compose} from 'redux'
import {applyOverlays} from 'skywall/frontend/utils/overlays'


export class SampleComponent extends React.Component {

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
  applyOverlays,
)(SampleComponent)
