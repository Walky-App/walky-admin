import { useState } from 'react'
import { Button, Checkbox, Label, Modal, TextInput } from 'flowbite-react'
import { RequestService } from '../../../services/RequestService'

export default function AdminFacilityContactModal({
  openModal,
  setOpenModal,
  currentContact,
  facilityId,
  setFacilityContacts,
}: any) {
  const [form, setform] = useState<any>(currentContact)
  const handleUpdateContact = async (e: any) => {
    const response = await RequestService(
      `/facilities/${facilityId}/contacts/${currentContact._id}`,
      'PATCH',
      form,
    )
    if (response) {
      setFacilityContacts(response)
      setOpenModal(false)
    }
  }

  return (
    <>
      <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Edit contact</h3>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="test" value="First Name" />
              </div>
              <TextInput
                type="text"
                name="test"
                id="test"
                defaultValue={currentContact.first_name}
                onChange={e => setform({ ...form, first_name: e.target.value })}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="last-name" value="Last name" />
              </div>
              <TextInput
                type="text"
                name="last_name"
                id="last-name"
                defaultValue={currentContact.last_name}
                onChange={e => setform({ ...form, last_name: e.target.value })}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="email" value="Your email" />
              </div>
              <TextInput
                type="text"
                name="email"
                id="email"
                defaultValue={currentContact.email}
                onChange={e => setform({ ...form, email: e.target.value })}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="phone-number" value="Phone number" />
              </div>
              <TextInput
                type="text"
                name="phone_number"
                id="phone-number"
                defaultValue={currentContact.phone_number}
                onChange={e => setform({ ...form, phone_number: e.target.value })}
                // defaultValue={contact.phone_number}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="Role" value="Role" />
              </div>
              <TextInput
                type="text"
                name="role"
                id="role"
                defaultValue={currentContact.role}
                onChange={e => setform({ ...form, role: e.target.value })}
              />
            </div>
            <div className="w-full">
              <Button onClick={handleUpdateContact}>Update</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  )
}
