# Contributing
---
## Get involved
Making `UploadJs` the best file upload widget in the world is only achievable with your help. Whether that is by [raising a fault](#raising-a-fault), [requesting an enhancement](#request-enhancement), full out [contributing](#contributing) yourself, or just spreading the word, everybody's involvement is hugely appreciated and welcomed.

Having said that, we expect you to follow the standard [code of conduct](http://contributor-covenant.org/version/1/3/0/code_of_conduct.txt) when getting involved.

---
<a href="#raising-a-fault" name="raising-a-fault"></a>
## Raising a fault
**Please search the issue archive to make sure you are not raising a duplicate**. Once your [issue](https://github.com/georgelee1/Upload.js/issues) has been reviewed and/or discussed it will either get `accepted` or `rejected`, and labelled appropriately. We make absolutely no promises as to the timescale of fixing issues.

To help with the issue review please make your issue is as detailed as possible otherwise it is likely to be `rejected`. Some handy pointers:

* **Overview** Give a detailed overview of the bug
* **Replication** Provide instructions on how to replicate the issue. Stacktraces are always helpful. A [fiddle](https://jsfiddle.net/) is even better.
* **Browsers** Give details of which browsers and **importantly** which version(s) the issue affects.
* **Suggestion** We love suggestions, how do we fix the bug?

---
<a href="#request-enhancement" name="request-enhancement"></a>
## Requesting an enhancement

Got an awesome idea for `UploadJs`, share it with us. Do check over the issue archive to make sure you are not raising a duplicate, sometimes other people also have the same brilliant idea. Once your [enhancement](https://github.com/georgelee1/Upload.js/issues) has been reviewed and/or discussed it will either get `accepted` or `rejected`, and labelled appropriately. We make absolutely no promises as to the timescale of implementing an new features.

To help with the issue review please make your issue is as detailed as possible otherwise it is likely to be `rejected`. Some handy pointers:

* **Overview** Give a detailed overview of the enhancement.
* **Use case** Give a fully reasoned use case for the enhancement. How is going to make the user's life easier?
* **Suggestion** We love suggestions, how do we go about implementing the enhancment.

---
<a href="#contributing" name="contributing"></a>
## Contributing
Before you begin there must exist an `accepted` [issue](https://github.com/georgelee1/Upload.js/issues) for the `bug` or `enhancement` that you are going to work on. Leave a comment that you are going to begin working on it (we'll assign the issue to you), you don't want to do a load of work to find some else has done it already.

`UploadJs` uses [nodejs](https://nodejs.org/en/) and [gulp](http://gulpjs.com/) for building, Javascript written in [ES6](http://es6-features.org/) and CSS written in [SCSS](http://sass-lang.com/). It is assumed that you are familar with these tools and know how to get rolling.

### Submitting a Pull Request (PR)
Follow these steps from start to PR:

* Fork `UploadJs`
* Create a branch (`git checkout -b <branch_name> origin/master`).
* The fun part... code, code, code
* The important part... test. Make sure that existing tests pass (`npm run test`). **Your work must also include appropriate test coverage for your new code**.
* Commit your changes (`git commit -a`). Ensure your commit message references the issue you are working on (`git commit -a -m "#<issue> My commit message"`)
* Push (`git push origin <branch_name>`)
* In GitHub create a Pull Request to `uploadjs:master`

---
## Thank you
We can't say it enough. Thank you.