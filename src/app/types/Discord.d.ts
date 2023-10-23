import { RESTPostAPIChannelMessageJSONBody } from 'discord-api-types/v10'

export interface DiscordMessage extends RESTPostAPIChannelMessageJSONBody {
  id: number
  timestamp: string
  author: {
    username: string
  }
}

export interface DiscordMessages {
  lastId: number
  messages: {
    [key: string]: DiscordMessage[]
  }
}
