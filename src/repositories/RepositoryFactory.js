import GroupsRepository from './GroupsRepository.js'
import ContactsRepository from './ContactsRepository.js'
import InteractionsRepository from './InteractionsRepository.js'
import SessionsRepository from './SessionsRepository.js'
import GiftsRepository from './GiftsRepository.js'
import JournalsRepository from './JournalsRepository.js'
import RemindersRepository from './RemindersRepository.js'

const repositories = {
  contacts: ContactsRepository,
  gifts: GiftsRepository,
  groups: GroupsRepository,
  interactions: InteractionsRepository,
  journals: JournalsRepository,
  sessions: SessionsRepository,
  reminders: RemindersRepository
}

export const RepositoryFactory = {
  get: (name) => repositories[name]
}
