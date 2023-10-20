import { Card } from '@canonical/react-components';
import { useEffect, useState } from 'react';

const formatDate = (date) => {
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

const CardContainer = () => {
  const [apiData, setApiData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          'https://people.canonical.com/~anthonydillon/wp-json/wp/v2/posts.json'
        );
        if (!response.ok) {
          throw new Error('Fetching data failed!');
        }
        const data = await response.json();

        const dataFromApi = data.map((item) => {
          return {
            id: item.id,
            author: item._embedded?.author[0]?.name,
            authorLink: item._embedded?.author[0]?.link,
            date: new Date(item.date),
            imageUrl: item.featured_media,
            title: item.title.rendered,
            link: item.link,
          };
        });

        setApiData(dataFromApi);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  const cards = apiData.map((card) => (
    <Card highlighted={true} className={'col-4 card__top-border'} key={card.id}>
      <div className="p-card__header u-sv-1">
        <h5 className="p-muted-heading">CLOUD AND SERVER</h5>
        <hr />
      </div>
      <div className="u-sv-1">
        <img
          src={card.imageUrl}
          className="p-card__image"
          alt="Blog post image, will vary depending on content"
        />
        <h3 className="p-card__title p-heading--4">
          <a href={card.link}>{card.title}</a>
        </h3>
        <p className="card__author-and-date">
          By <a href={card.authorLink}>{card.author}</a> on{' '}
          {formatDate(card.date)}
        </p>
      </div>
      <div className="card__footer">
        <hr />
        <span>Article</span>
      </div>
    </Card>
  ));

  return <div className="row card-container">{cards}</div>;
};

export default CardContainer;
