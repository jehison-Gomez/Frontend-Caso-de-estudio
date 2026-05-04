import { useState, useEffect, useCallback } from 'react'

const JDGDUseFetch = (fetchFn, deps = []) => {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  const JDGDLoad = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetchFn()
      setData(result)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, deps)

  useEffect(() => { JDGDLoad() }, [JDGDLoad])

  return { data, loading, error, refetch: JDGDLoad }
}

export default JDGDUseFetch