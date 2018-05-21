import React from 'react';
import Page from 'components/Page';
class Resutl extends React.Component {
  render() {
    const { images_config } = this.props.data;
    return <Page bg={`url(${images_config.result_bg})`} />;
  }
}

export default Resutl;
