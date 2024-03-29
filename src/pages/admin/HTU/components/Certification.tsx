import { Document, Page, Image, View, Text, Font, PDFViewer } from '@react-pdf/renderer'

import { useAdmin } from '../../../../contexts/AdminContext'
import { useAuth } from '../../../../contexts/AuthContext'
import type { IUser } from '../../../../interfaces/User'
import { type Module } from '../../../../interfaces/module'

export const Certification = () => {
  const { module } = useAdmin()
  const { user } = useAuth()
  return (
    <PDFViewer style={{ width: '100%', height: '100vh' }}>
      <Pdf data={module} user={user} />
    </PDFViewer>
    // temporal comment
    //<PDFDownloadLink document={<Pdf data={module} user={user} />} fileName="somename.pdf">
    //  {({ blob, url, loading, error }) =>
    //    loading ? 'Loading document...' : 'Download now!'
    //  }
    //</PDFDownloadLink>
  )
}

interface pdfProps {
  data: Module | undefined
  user: IUser | undefined
}

export const Pdf = ({ data, user }: pdfProps) => {
  const formaterDate = () => {
    const currentDate = new Date()
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'long', year: 'numeric' }
    const formattedDate = currentDate.toLocaleDateString('en-US', options)
    return formattedDate
  }

  Font.register({
    family: 'Montserrat',
    fonts: [
      { src: '/assets/fonts/Montserrat-Regular.ttf', fontWeight: 400 },
      { src: '/assets/fonts/Montserrat-Medium.ttf', fontWeight: 500 },
    ],
  })
  Font.register({
    family: 'BebasNeue',
    fonts: [{ src: '/assets/fonts/BebasNeue-Regular.ttf', fontWeight: 400 }],
  })

  return (
    <Document>
      <Page size="A4" orientation="landscape" wrap={false}>
        <View>
          <Image source="/assets/template/Hemp_Temps_University_Certificates.png" />
          <Text
            style={{
              position: 'absolute',
              left: '53%',
              top: '169px',
              fontSize: '12px',
              fontFamily: 'Montserrat',
              fontWeight: 500,
            }}>
            {formaterDate()}
          </Text>
          <Text
            style={{
              position: 'absolute',
              left: '47%',
              top: '182px',
              fontSize: '12px',
              fontFamily: 'Montserrat',
              fontWeight: 500,
            }}>
            65b132-d6fd6f-ef0d7d-26d48e
          </Text>
          <Text style={{ position: 'absolute', left: '44%', top: '280px', fontFamily: 'Montserrat' }}>
            {data?.category.title}
          </Text>
          <Text
            style={{
              position: 'absolute',
              left: '44%',
              top: '292px',
              fontSize: '75px',
              fontFamily: 'BebasNeue',
              color: '#95CA56',
            }}>
            {`${user?.first_name} ${user?.last_name}`}
          </Text>
        </View>
      </Page>
    </Document>
  )
}
