import styled from 'styled-components';

const Page = styled.div`
  height: ${props => (props.autoHeight ? 'auto' : '100%')};
  min-height: ${props => (props.autoHeight ? '100%' : 'auto')};
  background-image: ${props => props.bg || 'none'};
  background-repeat: ${props => (props.repeat ? 'repeat' : 'no-repeat')};
  background-size: 100%;
  background-color: orange;
`;

export default Page;
