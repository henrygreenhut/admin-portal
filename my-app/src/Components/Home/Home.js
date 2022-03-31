import React from 'react';
import EventOptions from './EventOptions/EventOptions';
import CurrentEvent from './CurrentEvent';
import UpcomingEvents from './UpcomingEvents';
import PreviousEvents from './PreviousEvents';
import "./Home.css";

function Home() {
  return (
    <div className="home">
        <div className="top-row">
          <EventOptions/>
          <CurrentEvent/>
        </div>
        <UpcomingEvents/>
        <PreviousEvents/>
    </div>
  )
}

export default Home;