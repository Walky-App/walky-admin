import { type IUser } from '../../../interfaces/User'
import { NotesComponent } from '../notes/NotesComponent'

export const ProfileNotes = ({ formUser, loggedInUser }: { formUser: IUser; loggedInUser: IUser | undefined }) => {
  return <NotesComponent ref_id={formUser._id as 'string'} model="users" created_by={loggedInUser?._id || ''} />
}
