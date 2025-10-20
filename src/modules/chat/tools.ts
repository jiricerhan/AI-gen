import { weatherTool } from "../weather";
import { anyApplicationTool } from "../any-application/tool";

export const tools = {
  displayWeather: weatherTool,
  createApplication: anyApplicationTool,
};