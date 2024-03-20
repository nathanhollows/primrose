<script setup>
import { onMounted } from 'vue'
import { auth } from '../auth/auth'
import { useRouter } from 'vue-router'
import { RepositoryFactory } from '../repositories/RepositoryFactory'

const router = useRouter()
const sessionsRepository = RepositoryFactory.get('sessions')

onMounted(() => {
  auth.logout()
  sessionsRepository.logout()
  router.push({ name: 'login' })
})
</script>
