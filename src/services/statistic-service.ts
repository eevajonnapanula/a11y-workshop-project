import { StatisticsData } from "./../types"
import axios from "axios"
import { GetStatisticsResponse, Language } from "../types"
import apiConfig from "./api-config"

const mapValues = (data: GetStatisticsResponse): StatisticsData => {
  const { category } = data.dimension.Tiedot
  const values = Object.keys(category.index).map((item) => {
    return {
      value: data.value[category.index[item]],
      label: category.label[item],
      unit: category.unit[item],
    }
  })
  const label = Object.values(data.dimension.Postinumeroalue.category.label)[0]
  return { label, values }
}

const getStatistics = async (postalCode: string, lang: Language): Promise<StatisticsData> => {
  try {
    const data = await axios.post<GetStatisticsResponse>(apiConfig[lang].url, {
      query: [
        {
          code: "Postinumeroalue",
          selection: {
            filter: "item",
            values: [postalCode],
          },
        },
      ],
      response: {
        format: "json-stat2",
      },
    })

    return mapValues(data.data)
  } catch (e) {
    console.log(e)
    let message
    if (e instanceof Error) {
      message = e.message
    } else {
      message = String(e)
    }
    return { values: [], label: "", error: message }
  }
}

const statisticsService = { getStatistics }

export default statisticsService
