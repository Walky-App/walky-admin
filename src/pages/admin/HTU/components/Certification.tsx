import { Button } from 'primereact/button'
import { v4 as uuidv4 } from 'uuid'

import { ShieldCheckIcon } from '@heroicons/react/24/solid'
import { Document, Page, Image, View, Text, Font, pdf } from '@react-pdf/renderer'

import { useAuth } from '../../../../contexts/AuthContext'
import type { IUser } from '../../../../interfaces/User'
import type { Category } from '../../../../interfaces/category'
import { requestService } from '../../../../services/requestServiceNew'
import { useUtils } from '../../../../store/useUtils'

interface CertificationProps {
  urlCertificate: string | undefined
  category: Category
}

export const Certification = ({ urlCertificate, category }: CertificationProps) => {
  const { user } = useAuth()
  const { showToast } = useUtils()

  const generateOrGetCertification = async () => {
    try {
      if (urlCertificate != '') {
        window.open(urlCertificate)
      } else {
        const certificationId = uuidv4()
        const blob = await pdf(<Pdf data={category} user={user} id={certificationId} />).toBlob()
        const formData = new FormData()
        formData.append('categoryId', category._id)
        formData.append('userId', user?._id as string)
        formData.append('file', blob, 'certificate.pdf')
        const response = await requestService({
          path: `lms/certificate/${certificationId}`,
          method: 'POST',
          dataType: 'formData',
          body: formData,
        })
        const data = await response.json()
        window.open(data.url)
      }
    } catch (error) {
      showToast({ severity: 'error', summary: 'Error', detail: 'Error generating certificate' })
    }
  }

  return (
    <button type="button" onClick={generateOrGetCertification} className="my-4 flex items-center">
      <ShieldCheckIcon className="mr-1 h-4 w-4 text-green-600" />
      <div className="text-sm underline">Completed Certificate</div>
    </button>
  )
}

interface PdfProps {
  data: Category | undefined
  user: IUser | undefined
  id: string
}

interface CertificationButtonProps {
  categoryId: string
}

export const CertificationButton = ({ categoryId }: CertificationButtonProps) => {
  const { user } = useAuth()
  const { showToast } = useUtils()

  const generateOrGetCertification = async () => {
    try {
      const responseCategory = await requestService({ path: `categories/${categoryId}` })
      const category = await responseCategory.json()

      const certificationId = uuidv4()
      const blob = await pdf(<Pdf data={category} user={user} id={certificationId} />).toBlob()
      const formData = new FormData()
      formData.append('categoryId', category._id)
      formData.append('userId', user?._id as string)
      formData.append('file', blob, 'certificate.pdf')
      const response = await requestService({
        path: `lms/certificate/${certificationId}`,
        method: 'POST',
        dataType: 'formData',
        body: formData,
      })
      if (response.ok) {
        const data = await response.json()
        window.open(data.url)
      }
    } catch (error) {
      showToast({ severity: 'error', summary: 'Error', detail: 'Error generating certificate' })
    }
  }

  return <Button size="large" label="Show certificate" onClick={generateOrGetCertification} />
}

export const Pdf = ({ data, user, id }: PdfProps) => {
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
          <Image source="https://hemptemps-prod.s3.amazonaws.com/learn/templates/Hemp_Temps_University_Certificates.png" />
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
            {id}
          </Text>
          <Text style={{ position: 'absolute', left: '44%', top: '280px', fontFamily: 'Montserrat' }}>
            {data?.title}
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
            {`${user?.first_name} ${user?.last_name !== undefined ? user?.last_name : ''}`}
          </Text>
        </View>
      </Page>
    </Document>
  )
}
