import { Helmet } from "react-helmet"


export default function getMeta(title, description, imageUrl, imageAlt){
    return (
        <Helmet>
          <title>{title}</title>
          <meta property="og:title" content={title} />
          <meta name="description" content={description} />
          <meta property="og:description" content={description} />
          <meta property="og:image" content={imageUrl?'https://vender-344408.ew.r.appspot.com' + imageUrl:'https://firebasestorage.googleapis.com/v0/b/vender-344408.appspot.com/o/email%2Flogo.png?alt=media&token=76822cb0-0db2-4a8b-8e6d-1d2ad2b8898d'} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:image:alt" content={imageAlt} />
        </Helmet>
      )
}