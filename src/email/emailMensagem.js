import {
  Body,
  Button,
  Container,
  Column,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Text,
  Link
} from "@react-email/components";
import * as React from "react";


const EmailMensagem = props => {
  return (
    <Html>
      <Head />
      <Preview>Yelp recent login</Preview>
      <Body style={main}>
        <Container>
          <Section style={logo}>
            <Img style={{width:'40px', height:'40px'}} src={'https://firebasestorage.googleapis.com/v0/b/vender-344408.appspot.com/o/email%2Flogo.png?alt=media&token=76822cb0-0db2-4a8b-8e6d-1d2ad2b8898d'} />
          </Section>

          <Section style={content}>
            <Row>
              <Img
                style={image}
                width={620}
                src={`https://firebasestorage.googleapis.com/v0/b/vender-344408.appspot.com/o/email%2Ffb_cover_photo_1.jpg?alt=media&token=754bec59-2fce-4546-a648-8d5d546f806c`}
              />
            </Row>

            <Row style={{ ...boxInfos, paddingBottom: "0" }}>
              <Column>
                <Heading
                  style={{
                    fontSize: 32,
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Olá {props.to},
                </Heading>
                <Heading
                  as="h2"
                  style={{
                    fontSize: 26,
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Recebeste 1 mensagem nova!
                </Heading>

                

                <Text style={paragraph}>
                  Acede à tua caixa de mensagens através do botão ou link a baixo.
                </Text>
              </Column>
            </Row>
            <Row style={{ ...boxInfos, paddingTop: "0", paddingBottom:'0'}}>
              <Column style={containerButton} colSpan={2}>
                <Button  href="https://pt-tarefas.pt/user?t=messages" style={button}>Ver Mensagens</Button>
              </Column>
            </Row>
            <Row style={{ ...boxInfos, paddingTop: "0"}}>
              <Column style={containerButton} colSpan={2}>
              <Link style={{paddingLeft:'10px'}} href="https://pt-tarefas.pt/">
                  <Text>Ver mensagens</Text>
              </Link>
              </Column>
            </Row>
            
          </Section>
        </Container>

  <Section style={{ textAlign: "center", marginTop:'60px', paddingBottom:'40px' }}>
    <table style={{ width: "100%" }}>
       <tr style={{ width: "100%", }}>
          <td align="center">
           <Link href="https://pt-tarefas.pt/">
             <Img
              alt="Terafas logo"
              height="42"
              // src='https://firebasestorage.googleapis.com/v0/b/vender-344408.appspot.com/o/email%2Flogo.png?alt=media&token=76822cb0-0db2-4a8b-8e6d-1d2ad2b8898d'
              src='https://firebasestorage.googleapis.com/v0/b/vender-344408.appspot.com/o/email%2Flogo_text_mix_4.png?alt=media&token=00eae584-f25d-4134-94b7-c0ce383e8693'
            />
            </Link>
          </td>
        </tr>
        <tr style={{ width: "100%" }}>
          <td align="center">
            {/* <Text
              style={{
                marginTop: 8,
                marginBottom: 8,
                fontSize: 16,
                lineHeight: "24px",
                fontWeight: 600,
                color: "rgb(17,24,39)",
              }}
            >
              TAREFAS
            </Text> */}
            <Text
              style={{
                marginTop: 4,
                marginBottom: 0,
                fontSize: 16,
                lineHeight: "24px",
                color: "rgb(107,114,128)",
              }}
            >
              Deixa para quem sabe...
            </Text>
          </td>
        </tr>
        <tr>
          <td align="center">
            <Row
              style={{
                display: "table-cell",
                height: 44,
                width: 56,
                verticalAlign: "bottom",
              }}
            >
              <Column style={{ paddingRight: 8 }}>
                <Link href="https://www.facebook.com/profile.php?id=61559666542359">
                  <Img
                    alt="Facebook"
                    height="36"
                    src={'https://firebasestorage.googleapis.com/v0/b/vender-344408.appspot.com/o/email%2Ffacebook.png?alt=media&token=8c9f8b27-894c-4303-a4bd-43905e35d50e'}
                    width="36"
                    style={{display:'block'}}
                  />
                </Link>
              </Column>
              <Column>
                <Link href="https://www.instagram.com/tarefaspt">
                  <Img
                    alt="Instagram"
                    height="36"
                    src={'https://firebasestorage.googleapis.com/v0/b/vender-344408.appspot.com/o/email%2FInstagram_icon.png.webp?alt=media&token=944e114c-4538-4633-86e2-c8f1cdff1c8d'}
                    width="36"
                    style={{display:'block'}}
                  />
                </Link>
              </Column>
            </Row>
          </td>
        </tr>
      </table>
    </Section>
      </Body>
    </Html>
  );
}

export default EmailMensagem;


const main = {
  backgroundColor: "#fff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const paragraph = {
  fontSize: 16,
};

const logo = {
  padding: "30px 20px",
};

const containerButton = {
  display: "flex",
  justifyContent: "center",
  width: "100%",
  marginTop:'10px'
};

const button = {
  backgroundColor: "#0358e5",
  borderRadius: 6,
  color: "#FFF",
  fontWeight: "bold",
  cursor: "pointer",
  padding: "16px 30px",
  fontSize:18
};

const content = {
  border: "1px solid rgb(0,0,0, 0.1)",
  borderRadius: "3px",
  overflow: "hidden",
};

const image = {
  maxWidth: "100%",
};

const boxInfos = {
  padding: "20px",
};

const containerImageFooter = {
  padding: "45px 0 0 0",
};