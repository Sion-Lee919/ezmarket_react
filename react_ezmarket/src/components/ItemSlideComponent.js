import { useState, useEffect } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import axios from 'axios';
import { Link } from 'react-router-dom';

const style = {
    carouselImg : {
        width: "100%",
        height: "300px",      
        objectFit: "cover"    
    },
    carousel : {
        width: "50%",    
    }
}

function ItemSlideComponent() {
    const [allItems, setAllItems] = useState([]);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        axios({
            url : `http://localhost:9090/getitemsforrandom`,
            method : 'GET',
        })
        .then(function(res){
            setAllItems(res.data);
        });
    }, [])

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  return (
    <div>
    <h1>추천상품</h1>
    <Carousel style={style.carousel}>
    {allItems.map(item => (
                <Carousel.Item interval={3000}>
                    <Link to={`/item/${item.product_id}`}>
                    <img src={`http://localhost:9090/showimage?filename=${item.image_url}`} style={style.carouselImg}/>
                    </Link>
                    <Carousel.Caption>
                    <h2>${item.name}</h2>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    </Carousel.Caption>
                </Carousel.Item>
                ))}
    </Carousel>
    </div>
  );
}

export default ItemSlideComponent;