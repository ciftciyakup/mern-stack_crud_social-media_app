import React from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";

const Tarihce = () => {
  return (
    <Container maxWidth={false} className="bg-kagit-900 text-white py-8">
      <Grid container justifyContent="center">
        <Grid item lg={10} xl={8} className="text-center">
          <Typography variant="h2" className="text-4xl font-semibold mb-6">
            Tarihçe
          </Typography>
          <Typography paragraph className="text-lg mb-6">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ad
            quibusdam placeat, ipsam repellat atque facere voluptatem nisi
            architecto repellendus necessitatibus dolorem inventore officiis
            eveniet, hic in, et vitae minus doloremque dolores sapiente qui
            ratione porro omnis voluptate? Cumque officia dicta voluptate
            excepturi beatae, consequatur porro id tempora dolor. Dolorum quam
            est, iusto exercitationem voluptatem soluta! Sunt consectetur quos,
            voluptates, quisquam distinctio dolor inventore reiciendis incidunt
            quo odio blanditiis ut vitae commodi sapiente totam explicabo quia.
          </Typography>
          <Typography paragraph className="text-lg mb-6">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Corporis
            in recusandae nobis, consequatur error suscipit qui consectetur
            saepe quia excepturi ea inventore. Molestias quae ab, exercitationem
            minus sit itaque inventore, culpa adipisci nihil dignissimos
            voluptatem vitae repellendus aperiam possimus maxime velit! Saepe
            quas ex architecto? Quam atque explicabo recusandae fugit officiis
            enim a odit tempore ullam, sequi nam similique, neque velit unde
            consequatur tenetur iusto! Expedita iste suscipit id sapiente neque
            doloribus excepturi quibusdam blanditiis.
          </Typography>
          <Button
            component={Link}
            to={"/tarihce"}
            variant="outlined"
            className="bg-white text-kagit-900 px-6 py-2 rounded-full hover:bg-opacity-80 transition duration-300"
          >
            Devamı
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Tarihce;
