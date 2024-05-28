# Todo

## features

### [Enhance] create shortLink

Enhance features of creating shortLink

- [ ] shortLink add filed `delete`, to delete the shortLink
- [ ] shortLink add filed `expire`, to set the expire time of the shortLink
- [ ] shortLinkMap add `notes` field, to store the notes of the shortLink
- [ ] change common shortLink request to `POST` method

### [Feature] data overview

Add data overview features

storage the visit count data to redis, async write to database in regular time (e.g. 2:00 AM).

visit number of shortLink in the last 24 hours, 7 days, 30 days should be stored in redis.

- [ ] storage the visit count data to redis, which should be stored in the format of `shortLink:visitCount` and could be range by `shortLink:*`
- [ ] async write the visit data to database in regular time (e.g. 2:00 AM)
