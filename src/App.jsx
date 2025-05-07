import { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { fetchDataFromApi } from './utils/api'
import { useDispatch } from 'react-redux';
import { getApiConfiguration, getGenres } from './store/homeSlice';
import Login from './pages/login/Login';
import Signup from './pages/signup/Signup';
import Header from "./components/header/Header"
import Footer from "./components/footer/Footer"
import PageNotFound from "./pages/404/PageNotFound"
import Explore from "./pages/explore/Explore"
import Details from "./pages/details/Details"
import {Home} from "./pages/home/Home"
import SearchResult from "./pages/searchResult/SearchResult"
import { AuthProvider } from './store/authContext';
import ProtectedRoute from './components/protectedRoute/ProtectedRoute';

function App() {
   
  const dispatch = useDispatch();
  // const {url} = useSelector((state) => state.home);

  useEffect(() => {
    fetchApiConfig();
    genresCall();
  }, [])

  const fetchApiConfig = () => {
    fetchDataFromApi('/configuration')
    .then((res) => {
      console.log(res);

      const url = {
        backdrop: res.images.secure_base_url + "original",
        poster: res.images.secure_base_url + "original",
        profile: res.images.secure_base_url + "original",
      }

      dispatch(getApiConfiguration(url))
    })
  }

  const genresCall = async () => {
    let promises = []
    let endPoints = ["tv", "movie"]
    let allGenres = {}

    endPoints.forEach((url) => {
      promises.push(fetchDataFromApi(`/genre/${url}/list`))
    })

    const data = await Promise.all(promises)
    data.map(({genres}) => {
      return genres.map((item) => (allGenres[item.id] = item))
    })

    dispatch(getGenres(allGenres))
  }

  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path='/' element={<Home />}/>
          <Route path='/login' element={<Login />}/>
          <Route path='/signup' element={<Signup />}/>
          <Route path='/:mediaType/:id' element={
            <ProtectedRoute>
              <Details />
            </ProtectedRoute>
          }/>
          <Route path='/explore/:mediaType' element={
            <ProtectedRoute>
              <Explore />
            </ProtectedRoute>
          }/>
          <Route path='/search/:query' element={<SearchResult />}/>
          <Route path='*' element={<PageNotFound />}/>
        </Routes>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
