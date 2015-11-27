import {run as options} from "./util/options.test"
import {run as queue} from "./util/queue.test"
import {run as http} from "./util/http.test"
import {run as dom} from "./util/dom.test"
import {run as cache} from "./util/cache.test"
import {run as object} from "./util/object.test"
import {run as item} from "./ui/item.test"
import {run as update} from "./ui/update.test"
import {run as upload} from "./ui/upload.test"

options()
queue()
http()
dom()
cache()
object()
item()
update()
upload()