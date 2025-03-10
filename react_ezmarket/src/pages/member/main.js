import { useNavigate } from 'react-router-dom';
import ItemSlideComponent from '../../components/ItemSlideComponent';
import KakaomapShopInfoComponent from '../../components/KakaomapShopInfoComponent';
import MainBannerSlide from "../../components/MainBannerSlide";

const Main = () => {

  return (
    <div>
      <MainBannerSlide />
      <ItemSlideComponent></ItemSlideComponent>
      <hr/>
      <h1>가까운 양조장</h1><KakaomapShopInfoComponent></KakaomapShopInfoComponent>
      <p>등</p>
    </div>
  );
};

export default Main;