# Todo

## features

### [Enhance] create shortLink

Enhance features of creating shortLink

- [x] shortLink add filed `delete`, to delete the shortLink, add delete api
- [ ] shortLink add filed `expire`, to set the expire time of the shortLink
- [ ] shortLinkMap add `notes` field, to store the notes of the shortLink
- [ ] change common shortLink request to `POST` method

### [Feature] data overview

Add data overview features

storage the visit count data to redis, async write to database in regular time (e.g. 2:00 AM).

visit number of shortLink in the last 24 hours, 7 days, 30 days should be stored in redis.

- [x] Store the visit count data in Redis, which should be stored in the format of `[dateVisitCount] shortCodeId_ShortCode` and could be accessed/queried using the pattern `shortLink:*`.
- [x] Asynchronously transfer the visit data to the database at regular intervals (e.g., at 2:00 AM).
- [x] Remove the daily Redis data at a regular time (0:00 AM).
- [ ] Add api to query a time range data in influxDB(previous day,last 7 days, last 30 days,etc...)
