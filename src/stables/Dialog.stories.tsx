import React, { useState } from "react";
import { Dialog } from "./Dialog";
import { Button } from "../atoms/FormBaseUis";

export default {
  title: "Dialog",
  component: Button,
};

export const Basic: React.FC = () => {
  const [open, setOpen] = useState(false);
  return (
    <div id="main">
      <div className="ui-container">
        <p>
          <Button onClick={() => setOpen(true)}>Open</Button>
        </p>
        <p>
          Using{" "}
          <a href="http://reactcommunity.org/react-modal/" target="_blank">
            react-modal 🚀
          </a>
        </p>
      </div>
      <Dialog
        isOpen={open}
        onRequestClose={() => setOpen(false)}
        title="Hello World!"
      >
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis
          nobis et, accusantium facere expedita quibusdam quod praesentium eaque
          eos inventore ex, ipsa ad voluptatibus hic ratione nulla? Dolor,
          officia quo.
        </p>
      </Dialog>
    </div>
  );
};
