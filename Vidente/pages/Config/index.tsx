import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useContext, useEffect, useState } from 'react'
import { Header } from 'react-native/Libraries/NewAppScreen'
import { DefaultTheme, ThemeContext } from 'styled-components/native'
import CityCard from '../../components/CityCard'
import { UserContext } from '../../context/UserContext'
import City from '../../models/City'
import { RootStackParamList } from '../../navigation'
import CityService from '../../services/CityService'
import dark from '../styles/theme/dark'
import light from '../styles/theme/light'
import { CityFilterInput, Container, ScrollPanel } from './styles'

type Props = NativeStackScreenProps<RootStackParamList, 'Config'>

const Config = ({ navigation }: Props) => {
  const [filter, setFilter] = useState('')
  const [filteredCities, setFilteredCities] = useState<City[]>([])

  const [theme, setTheme] = useState<DefaultTheme>(light);
  const toggleSwitch = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(nextTheme)
  };
  
  const cityService = new CityService()
  const cities = cityService.cities

  useEffect(() => {
    let citiesFound: City[] = []
    if (filter) {
      citiesFound = cities.filter((c) =>
        c.name.toLowerCase().includes(filter.toLowerCase())
      )
    }

    setFilteredCities(
      citiesFound.length > 0 ? citiesFound.slice(0, 5) : citiesFound
    )
  }, [filter])

  const { setCityName, setCityCode } = useContext(UserContext)

  const onCitySelected = (city: City) => {
    setCityName(`${city.name}-${city.state}`)
    cityService.findCityCode(city.name).then((cityCode) => {
      setCityCode(cityCode)
      navigation.pop()
    })
  }

  return (
    <Container>
      <ThemeContext.Provider value={{ theme, toggleSwitch }}>
        <Header toggleTheme={toggleSwitch} />
      </ThemeContext.Provider>
      
      <CityFilterInput
        placeholder='Digite o nome da cidade'
        value={filter}
        onChangeText={setFilter}
      />
      
      {filteredCities.length > 0 && (
        <ScrollPanel>
          {filteredCities.map((city, index) => (
            <CityCard
              key={index}
              cityName={city.name}
              cityState={city.state}
              onPress={() => onCitySelected(city)}
            />
          ))}
        </ScrollPanel>
      )}
    </Container>
  )
}
  export default Config