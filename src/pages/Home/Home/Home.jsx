import React from "react";
import Baneer from "../Baneer/Baneer";
import Services from "../services/Services";
import Clients from "../Clients/Clients";
import Benefits from "../Banefits/Banefits";
import BeMerchant from "../BeMerchant/BeMerchant";
import CustomerReview from "../CustomerReview/CustomerReview";
import Delivery from "../Delivery/Delivery";
import Accordion from "../Accordion/Accordion";

const Home = () => {
  return (
    <div>
      <h2>This is Home </h2>
      <Baneer></Baneer>
      <Delivery></Delivery>
      <Services></Services>
      <Clients></Clients>
      <Benefits></Benefits>
      <BeMerchant></BeMerchant>
      <CustomerReview></CustomerReview>
      <Accordion></Accordion>
    </div>
  );
};

export default Home;
