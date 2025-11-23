import { LoaderIcon } from 'lucide-react'

const Loader = () => {
  return (
    <div className="h-screen flex justify-center items-center">
        <LoaderIcon className="animate-spin h-8 w-8 text-gray-600" />
    </div>
  )
}

export default Loader