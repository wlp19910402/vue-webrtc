import moment from "moment";
import axios from "axios";
// 获取星期几
function getWeek(date: any) {
  // 参数时间戳
  let week = moment(date).day();
  switch (week) {
    case 1:
      return "星期一";
    case 2:
      return "星期二";
    case 3:
      return "星期三";
    case 4:
      return "星期四";
    case 5:
      return "星期五";
    case 6:
      return "星期六";
    case 0:
      return "星期天";
  }
}
// 获取时间
export function getDate() {
  let time = new Date().getTime();
  let mu: any = moment(time).minutes();
  let moTime = moment(time);
  let month = moment(time).month() + 1;
  let day = moment(time).date();
  return {
    date: moTime.format("YYYY-MM-DD"),
    week: getWeek(time),
    minute: parseInt(mu) < 10 ? "0" + mu : mu,
    hour: moTime.hours(),
    second: moTime.second(),
    month: month < 10 ? "0" + month : month,
    year: moTime.year(),
    day: day < 10 ? "0" + day : day,
  };
}
// 天气图标
const weatherIcons: any = {
  晴: "icon-tianqi-qing",
  少云: "icon-tianqi-duoyun",
  晴间多云: "icon-tianqi-duoyun",
  多云: "icon-tianqi-duoyun",
  阴: "icon-tianqi-yin",
  霾: "icon-tianqi-wumai",
  中度霾: "icon-tianqi-wumai",
  重度霾: "icon-tianqi-wumai",
  严重霾: "icon-tianqi-wumai",
  阵雨: "icon-tianqi-zhenyu",
  雷阵雨: "icon-tianqi-leizhenyu",
  雷阵雨并伴有冰雹: "icon-tianqi-leiyubingbao",
  小雨: "icon-tianqi-yu",
  中雨: "icon-tianqi-xiaoyuzhuanzhongyu",
  大雨: "icon-tianqi-dayu",
  暴雨: "icon-tianqi-dayuzhuanbaoyu",
  大暴雨: "icon-tianqi-dabaoyu",
  特大暴雨: "icon-tianqi-dayuzhuantedabaoyu",
  强阵雨: "icon-tianqi-zhenyu",
  强雷阵雨: "icon-tianqi-zhenyu",
  极端降雨: "icon-tianqi-dayuzhuantedabaoyu",
  "毛毛雨/细雨": "icon-tianqi-yu",
  雨: "icon-tianqi-yu",
  "小雨-中雨": "icon-tianqi-xiaoyuzhuanzhongyu",
  "中雨-大雨": "icon-tianqi-zhongyuzhuandayu",
  "大雨-暴雨": "icon-tianqi-dabaoyu",
  "暴雨-大暴雨": "icon-tianqi-tedabaoyu",
  "大暴雨-特大暴雨": "icon-tianqi-tedabaoyu",
  雨雪天气: "icon-tianqi-yujiaxue",
  雨夹雪: "icon-tianqi-yujiaxue",
  阵雨夹雪: "icon-tianqi-zhenxue",
  冻雨: "icon-tianqi-dongyu",
  雪: "icon-tianqi-xue",
  阵雪: "icon-tianqi-zhenxue",
  小雪: "icon-tianqi-xue",
  中雪: "icon-tianqi-zhongxue",
  大雪: "icon-tianqi-daxue",
  暴雪: "icon-tianqi-baoxue",
  "小雪-中雪": "icon-tianqi-zhongxue",
  "中雪-大雪": "icon-tianqi-daxue",
  "大雪-暴雪": "icon-tianqi-baoxue",
  浮尘: "icon-tianqi-fuchen",
  扬沙: "icon-tianqi-yangsha",
  沙尘暴: "icon-tianqi-shachenbao",
  强沙尘暴: "icon-tianqi-tedashachenbao",
  龙卷风: "icon-tianqi-tedashachenbao",
  雾: "icon-tianqi-wu",
  浓雾: "icon-tianqi-shachenbao",
  强浓雾: "icon-tianqi-tedashachenbao",
  轻雾: "icon-tianqi-wu",
  大雾: "icon-tianqi-wu",
  特强浓雾: "icon-tianqi-tedashachenbao",
};
// 天气信息
export const getWeather = async () => {
  let ip = await localStorage.getItem("ip");
  let city = "北京市"; //城市
  let province = "北京";
  let country = "中国";
  let weather = "晴"; //天气
  let temperature = 20; //温度 摄氏度
  let humidity = 20; //湿度
  let icon = "icon-tianqi-qing";
  try {
    if (ip) {
      const key = "31aab48f19b803a3c959a4819576e92b";
      let addressRes = await axios.get("https://restapi.amap.com/v5/ip", {
        params: {
          ip,
          key,
          type: 4,
        },
      });

      if (addressRes.status === 200) {
        province = addressRes.data.province;
        country = addressRes.data.country;
        city = addressRes.data.city;
        let geocodesRes = await axios.get(
          "https://restapi.amap.com/v3/geocode/geo",
          {
            params: {
              key,
              address: addressRes.data.province + addressRes.data.city,
            },
          }
        );

        if (geocodesRes.status === 200) {
          let weatherRes = await axios.get(
            "https://restapi.amap.com/v3/weather/weatherInfo?parameters",
            {
              params: {
                key,
                city: geocodesRes.data.geocodes[0].adcode,
              },
            }
          );
          let lives = weatherRes.data.lives[0];
          let isIcon = weatherIcons[lives.weather];
          weather = isIcon ? lives.weather : "晴";
          temperature = lives.temperature;
          humidity = lives.humidity;
          icon = isIcon ? isIcon : "icon-tianqi-qing";
        }
      }
    }
  } catch {
    console.log(222);
  }
  return {
    city,
    weather,
    temperature,
    humidity,
    icon,
    province,
    country,
  };
};
