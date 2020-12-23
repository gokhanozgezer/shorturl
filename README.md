# Short URL ( Kısa Link )
* [Turkce Dokuman](#turkce-dokuman)
* [English Document](#english-document)

## Turkce Dokuman

## İçindekiler
* [Genel Bilgi](#genel-bilgi)
* [Teknoloji](#teknoloji)
* [Kurulum](#kurulum)
* [Demo Link](#demo-link)
* [API Kullanim](#api-kullanim)

## Genel Bilgi
Sahip olduğunuz uzun karakterli erişim linklerinizi kısaltmanıza yarar. İstatistik özellikleri ile bu kısa linklere erişim bilgilerini de görüntüleyebilirsiniz.

## Teknoloji
Proje NodeJS ve MongoDB kullanılarak oluşturuldu

## Kurulum
Projeyi çalıştırmak için;
Öncelikle config/default.json dosyasını düzenlemelisiniz
```
{
    "mongoURI": "{MongoDB URL}", -> MongoDB erişim bilgilerinizi bu alana yazınız. Örn : mongodb://localhost:27017/myapp
    "shortDomain": "{Kısa URL}", -> Alan adı, Linklerinizde kullanılacak alan adı adresi. Kullanabilmek için alan adınız için DNS A kaydı oluşturmalısınız
    "apiKey": false, -> API kullanımı için apiKey ihtiyacınız var. Bu alana ne yazacağınıza karar veremezseniz, projeyi ilk çalıştırdığınız zaman otomatik oluşturulacaktır.
    "urlDefaultValidityDay": 365, -> Bu alan linklerinizin geçerlilik süresini belirtir. Oluşturma aşamasında isterseniz "validityTime" bilgisi ile geçerlilik süresi belirleyebilirsiniz.
    "cronDay": 365, -> Belli bir zaman sonra URL ve İstatistik bilgilerinin silinmesini isterseniz bu alanı kullanabilirsiniz.
    "port": 3000, -> HTTP Port
    "securePort": 3001 -> HTTPS Port
}
```

NPM veya Yarn ile kurulumu:
```
$ cd ../shorturl
$ npm install
$ npm start
```

```
$ cd ../shorturl
$ yarn
$ yarn start
```

IP ve PORT kullanmadan domain ile kullanmak isterseniz Proxy ayarları yapmalısınız.

NGINX proxy ayarları :
```
location / {
  proxy_pass http://localhost:3000;
  proxy_http_version 1.1;
  proxy_set_header Upgrade $http_upgrade;
  proxy_set_header Connection 'upgrade';
  proxy_set_header Host $host;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_set_header X-Forwarded-Proto $scheme;
  proxy_cache_bypass $http_upgrade;
}
```

APACHE proxy ayarları :
```
<VirtualHost *:80>
    ServerName yourdomain.com
    
    ProxyRequests off

    <Proxy *>
            Order deny,allow
            Allow from all
    </Proxy>

    <Location />
            ProxyPass http://localhost:3000/
            ProxyPassReverse http://localhost:3000/
    </Location>
</VirtualHost>
```
Apache için conf dosyasına aşağıda bulunan mod_proxy leri eklemeniz gerekiyor;

`LoadModule proxy_module modules/mod_proxy.so`

`LoadModule proxy_http_module modules/mod_proxy_http.so`

## Demo Link
[Demo](https://shorturl.kodhouse.co/) buradan inceleyebilirsiniz.

## API Kullanim
### Kısa URL Oluşturma

Headers alanında ApiKey göndermelisiniz fakat "Authorization" kullanarak.

`Authorization : "AYAeheWU9gcDdE4f8YI..." -> Api Key`

`Method : POST`

`URL : http://localhost:3000/api/`

```
// Göndereceğiniz istek
{
    "validityTime" : 1, // Opsiyonel, default : 365 gün;
    "longUrl" : "Orjinal Linkiniz" //Gerekli
}
```
```
// Sonuç
{
    "longUrl": "Orjinal Linkiniz",
    "shortUrl": "Oluşturulan Kısa URL",
    "urlCode": "URL Benzersiz Kodu",
    "validityAt": "2021-12-22T15:51:13.035Z", // URL Geçerlilik Süresi
    "ipInfo": {
        "ip": "IP Adres",
        "range": [
            784691200,
            784693247
        ],
        "country": "TR",
        "region": "07",
        "eu": "0",
        "timezone": "Europe/Istanbul",
        "city": "Antalya",
        "ll": [
            36.8867,
            30.6866
        ],
        "metro": 0,
        "area": 1
    },
    "device": "phone"
}
```

### URL İstatistik

Headers alanında ApiKey göndermelisiniz fakat "Authorization" kullanarak.

`Authorization : "AYAeheWU9gcDdE4f8YI..." -> Api Key`

`Method : GET`

`URL : http://localhost:3000/api/{URL Benzersiz Kod}`

```
// Sonuç
{
    "status": true,
    "urlCode": "{URL Benzersiz Kod}",
    "data": [
        {
            "latlong": [
                36.8867,
                30.6866
            ],
            "country": "TR",
            "city": "Antalya",
            "ip": "{IP Adres}",
            "device": "desktop",
            "date": "2020-12-19T20:26:08.938Z"
        },
        {
            "latlong": [
                37.2181,
                28.3665
            ],
            "country": "TR",
            "city": "Mugla",
            "ip": "{IP Adres}",
            "device": "phone",
            "date": "2020-12-20T09:09:28.488Z"
        }
    ],
    "markerList": "[[36.8867,30.6866],[37.2181,28.3665]]", // Haritada göstermek isterseniz
    "viewList": {
        "desktop": 1,
        "phone": 1
    },
    "urlData": {
        "validityAt": "2020-12-20T20:23:36.876Z",
        "longUrl": "{Orjinal Linkiniz}",
        "shortUrl": "{Oluşturulan Kısa URL}",
        "urlCode": "{URL Benzersiz Kodu}",
        "createdAt": "2020-12-19T20:13:36.905Z"
    },
    "domain": "{Kısa URL için kullandığınız alan adı}"
}
```

## English Document

## Table of contents
* [General info](#general-info)
* [Technologies](#technologies)
* [Setup](#setup)
* [Demo](#demo)
* [API](#api)

## General info
URL shortener script packed with many unique features. It allows you to shorten a long link into short smart link.
It helps to shorten the long character access links you have. You can also view access information to these short links with statistics features.

It will allow you to shorten your long url link for your projects or payment infrastructure.

## Technologies
Project is created with: NodeJS with MongoDB

## Setup
To run this project;
Firstly you must edit config/default.json file
```
{
    "mongoURI": "{MongoDB URL}", -> Write your MongoDB connect URL with table name, exp : mongodb://localhost:27017/myapp
    "shortDomain": "{Short URL}", -> Your Short URL domain, you must edit DNS A record for project server. 
    "apiKey": false, -> You need apiKey for API. If you can't decide what to do, the project will automatically create an "apikey" when it first runs.
    "urlDefaultValidityDay": 365, -> This is default validityDay but you can use "validityTime" variable when send longUrl with API.
    "cronDay": 365, -> You can use it if you want to periodically delete URL and Statistics Information.
    "port": 3000, -> HTTP Port
    "securePort": 3001 -> HTTPS Port
}
```

install it locally using npm or yarn:
```
$ cd ../shorturl
$ npm install
$ npm start
```

```
$ cd ../shorturl
$ yarn
$ yarn start
```

If you want using domain without Port you need proxy settings.

NGINX proxy settings :
```
location / {
  proxy_pass http://localhost:3000;
  proxy_http_version 1.1;
  proxy_set_header Upgrade $http_upgrade;
  proxy_set_header Connection 'upgrade';
  proxy_set_header Host $host;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_set_header X-Forwarded-Proto $scheme;
  proxy_cache_bypass $http_upgrade;
}
```

APACHE proxy settings :
```
<VirtualHost *:80>
    ServerName yourdomain.com
    
    ProxyRequests off

    <Proxy *>
            Order deny,allow
            Allow from all
    </Proxy>

    <Location />
            ProxyPass http://localhost:3000/
            ProxyPassReverse http://localhost:3000/
    </Location>
</VirtualHost>
```
You must add mod_proxy for Apache conf file;

`LoadModule proxy_module modules/mod_proxy.so`

`LoadModule proxy_http_module modules/mod_proxy_http.so`

## Demo
See the [Demo](https://shorturl.kodhouse.co/)

## API
### Create Short URL

You must send Apikey in Headers

`Authorization : "AYAeheWU9gcDdE4f8YI..." -> Your Api Key`

`Method : POST`

`URL : http://localhost:3000/api/`

```
// Request Variables
{
    "validityTime" : 1, // Optional, default : 365 days;
    "longUrl" : "Your Original URL" //Required
}
```
```
// Response
{
    "longUrl": "Original Long URL",
    "shortUrl": "Short URL",
    "urlCode": "URL Unique Code",
    "validityAt": "2021-12-22T15:51:13.035Z", // URL Validity Date
    "ipInfo": {
        "ip": "IP Address",
        "range": [
            784691200,
            784693247
        ],
        "country": "TR",
        "region": "07",
        "eu": "0",
        "timezone": "Europe/Istanbul",
        "city": "Antalya",
        "ll": [
            36.8867,
            30.6866
        ],
        "metro": 0,
        "area": 1
    },
    "device": "phone"
}
```

### URL Statistics

You must send Apikey in Headers

`Authorization : "AYAeheWU9gcDdE4f8YI..." -> Your Api Key`

`Method : GET`

`URL : http://localhost:3000/api/{Unique URL Code}`

```
// Response
{
    "status": true,
    "urlCode": "{Unique URL Code}",
    "data": [
        {
            "latlong": [
                36.8867,
                30.6866
            ],
            "country": "TR",
            "city": "Antalya",
            "ip": "{IP Address}",
            "device": "desktop",
            "date": "2020-12-19T20:26:08.938Z"
        },
        {
            "latlong": [
                37.2181,
                28.3665
            ],
            "country": "TR",
            "city": "Mugla",
            "ip": "{IP Address}",
            "device": "phone",
            "date": "2020-12-20T09:09:28.488Z"
        }
    ],
    "markerList": "[[36.8867,30.6866],[37.2181,28.3665]]", // If you want show in map
    "viewList": {
        "desktop": 1,
        "phone": 1
    },
    "urlData": {
        "validityAt": "2020-12-20T20:23:36.876Z",
        "longUrl": "Original Long URL",
        "shortUrl": "Short URL",
        "urlCode": "{Unique URL Code}",
        "createdAt": "2020-12-19T20:13:36.905Z"
    },
    "domain": "{Short URL Domain Address Info}"
}
```
