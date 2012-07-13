module Utils where 

import Yesod   hiding (Route(..))
import Foundation
import Prelude hiding (writeFile, readFile, head, tail, init, last)

makeTable :: [String] -> (a -> Widget) -> [a] -> Widget
makeTable headers rowF rows = [whamlet|
<table border=1>
  ^{makeHeaderRow headers}
  $forall row <- rows
    <tr>^{rowF row}
|]

makeHeaderRow hs = [whamlet|
<tr>
$forall h <- hs
  <th>#{h}
|]


makeTable' :: (a -> Widget) -> [a] -> Widget
makeTable' rowF rows = [whamlet|
<table>
  $forall row <- rows
    <tr>^{rowF row}
|]
