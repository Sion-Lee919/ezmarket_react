import { useNavigate } from 'react-router-dom';
import ItemSlideComponent from '../../components/ItemSlideComponent';
import KakaomapShopInfoComponent from '../../components/KakaomapShopInfoComponent';
const Main = () => {

  return (
    <div>
      <ItemSlideComponent></ItemSlideComponent>
      <hr/>
      <h1>가까운 양조장</h1><KakaomapShopInfoComponent></KakaomapShopInfoComponent>
      <p>등</p>
    </div>
  );
};

export default Main;