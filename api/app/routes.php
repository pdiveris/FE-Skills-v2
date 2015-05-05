<?php use BrianReeve\MimeType\MimeType;
/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the Closure to execute when that URI is requested.
|
*/

Route::when('redis*', 'redis');
Route::filter('redis', function () {
  if (!Bentleysoft\Helper::userHasAccess(array('redis.admin'))) {
  // \Illuminate\Support\Facades\Redirect::to('login');
  return \Illuminate\Support\Facades\Redirect::to('/login');
  }
  return;
});

/**
 * Redis stuff
 */
Route::controller('redis', 'RedisController');


Route::get('test', function() {

  $uid = '10949/11539';
  $handle = Handle::where('handle', '=', $uid)->first();

    if (null == $handle || !$handle) {
      throw new Exception('Ouch....');
    } 
    echo "Got handle {$handle->handle} with resource_id {$handle->resource_id} <br/>";
    $item = Item::where('item_id', '=', $handle->resource_id)->first();

    $sequenceId = 9238567;
    $org = array();
    $count = 0;
    foreach ($item->bundles()->get()->all() as $bundle) {
        if ($bundle->name == 'ORIGINAL') {
          foreach ($bundle->bitstreams()->get()->all() as $bitstream) {

            // Use brianreeve's library to guess MIME
            $mime = MimeType::detect($bitstream->name);

            // PhpConsole::debug($bitstream->name. '   '. $mime);

            $originals[] = array($bundle->bundle_id=>array('name'=>$bundle->name, 
                                                           'internal_id'=>$bitstream->internal_id, 
                                                           'name'=>$bitstream->name,
                                                           'format'=>MIMAS\Helpers::humanMime($mime),   // get the 'human' format string
                                                           'mime'=>$mime,
                                                           'bitstream'=>$bitstream,
                                                           )); 
            if ($count == 0) {
              $org = array('name'=>$bundle->name, 
                                   'internal_id'=>$bitstream->internal_id, 
                                   'name'=>$bitstream->name,
                                   'format'=>MIMAS\Helpers::humanMime($mime),   // get the 'human' format string
                                   'mime'=>$mime,
                                   'bundle_id'=>$bundle->bundle_id,
                                  ); 

            }

            if ($bitstream->sequence_id < $sequenceId) {
              $sequenceId = $bitstream->sequence_id;
            }
            // Hep
            $count++;

          }
        } elseif(true) {

        }

    }
    var_dump($org);

});


Route::post('/items', function() {
  class apiResponse {
    var $item = array();
    var $original = null;
    var $tile = array();
  }

//  PhpConsole::debug(date('H:m:i:s u'));  

  $data = Input::get('data', array());

  $ret = array();
  
  $keys = array();
  foreach ($data as $i=>$object) {
    $id = $object['_id'];

    // jorum stuff
    $uid = str_replace('jorum-10949-', '10949/', $id);

    // 1. handle->resource_id
    $handle = Handle::where('handle', '=', $uid)->first();
    

    if (null == $handle || !$handle) return;
///    PhpConsole::debug($handle->handle);

    // 2. get the item 
    $item = Item::where('item_id', '=', $handle->resource_id)->first();

    if (null == $item || ! $item) return;

    // 5. Get bitstreams
    
    $originals = array();
    $org = array();

    $sequenceId = 9238567;
    $count = 0;

    /************* * *****************/
      
      foreach ($item->bundles()->get()->all() as $bundle) {
        if ($bundle->name == 'ORIGINAL') {
          foreach ($bundle->bitstreams()->get()->all() as $bitstream) {

            // Use brianreeve's library to guess MIME
            $mime = MimeType::detect($bitstream->name);

            // PhpConsole::debug($bitstream->name. '   '. $mime);

            $originals[] = array($bundle->bundle_id=>array('name'=>$bundle->name, 
                                                           'internal_id'=>$bitstream->internal_id, 
                                                           'name'=>$bitstream->name,
                                                           'format'=>MIMAS\Helpers::humanMime($mime),   // get the 'human' format string
                                                           'mime'=>$mime,
                                                           'bitstream'=>$bitstream,
                                                           )); 
            if ($count == 0) {
              $org = array('name'=>$bundle->name, 
                                   'internal_id'=>$bitstream->internal_id, 
                                   'name'=>$bitstream->name,
                                   'format'=>MIMAS\Helpers::humanMime($mime),   // get the 'human' format string
                                   'mime'=>$mime,
                                   'bundle_id'=>$bundle->bundle_id,
                                  ); 

            }

            if ($bitstream->sequence_id < $sequenceId) {
              $sequenceId = $bitstream->sequence_id;
            }
            // Hep
            $count++;

          }

        } elseif ($bundle->name == 'URL_BUNDLE') {
            
            $bitstreams = $bundle->bitstreams()->get()->all();

            if (count($bitstreams)>0) {
              $bitstream = $bitstreams[0];

              $format = 'external';
              if (strpos($bitstream->name, 'http://vimeo.com')!==false) {
                $format = 'video';
              }

              $originals[] = array($bundle->bundle_id=>array('name'=>$bundle->name, 
                                                             'internal_id'=>$bitstream->internal_id, 
                                                             'name'=>$bitstream->name,
                                                             'format'=>$format,   // get the 'human' format string
                                                             'mime'=>'extlink',
                                                             'bitstream'=>$bitstream,
                                                             )); 
              if ($count == 0) {
                $org = array('name'=>$bundle->name, 
                                     'internal_id'=>$bitstream->internal_id, 
                                     'name'=>$bitstream->name,
                                     'format'=>$format,   // get the 'human' format string
                                     'mime'=>'extlink',
                                     'bundle_id'=>$bundle->bundle_id,
                                    ); 

              }
          }
        }

      }

    /************* * *****************/


    $pet = new apiResponse;

    $pet->item['dc_title'] = $item->dc_title;
    $pet->item['dc_description'] = $item->dc_description;

    $pet->originals = $originals;
  
    if (count($originals)>0) {
      $pet->original = $org;

    }

    $ret[$id] = $pet;

  }
  //  PhpConsole::debug(date('H:m:i:s u'));  
  return Response::json($ret);


});

Route::get('/item/{u?}/{id?}', function ($u = '', $id = '') {
  class apiResponse {
    var $item = array();
    var $original = null;
    var $tile = array();
  }

  $u = str_replace('jorum-', '', $u);
  $u = str_replace('-', '/', $u);

  // dspace


  // 1. handle->resource_id
  $handle = Handle::where('handle', '=', $u)->first();

  // 2. get the item 
  $item = Item::where('item_id', '=', $handle->resource_id)->first();

  // 5. Get bitstreams
  
  $originals = array();
  $org = array();

  $sequenceId = 9238567;
  $count = 0;

  foreach ($item->bundles()->get()->all() as $bundle) {
    if ($bundle->name == 'ORIGINAL') {
      foreach ($bundle->bitstreams()->get()->all() as $bitstream) {

        // Use brianreeve's library to guess MIME
        $mime = MimeType::detect($bitstream->name);

        $originals[] = array($bundle->bundle_id=>array('name'=>$bundle->name, 
                                                       'internal_id'=>$bitstream->internal_id, 
                                                       'name'=>$bitstream->name,
                                                       'format'=>MIMAS\Helpers::humanMime($mime),   // get the 'human' format string
                                                       'mime'=>$mime,
                                                       'bitstream'=>$bitstream,
                                                       )); 
        if ($count == 0) {
          $org = array('name'=>$bundle->name, 
                               'internal_id'=>$bitstream->internal_id, 
                               'name'=>$bitstream->name,
                               'format'=>MIMAS\Helpers::humanMime($mime),   // get the 'human' format string
                               'mime'=>$mime,
                               'bundle_id'=>$bundle->bundle_id,
                              ); 

        }

        if ($bitstream->sequence_id < $sequenceId) {
          $sequenceId = $bitstream->sequence_id;
        }
      }

    } elseif ($bundle->name == 'URL_BUNDLE') {
        
        $bitstreams = $bundle->bitstreams()->get()->all();

        if (count($bitstreams)>0) {
          $bitstream = $bitstreams[0];

          $format = 'mixed';
          if (strpos($bitstream->name, 'http://vimeo.com')!==false) {
            $format = 'video';
          }

          $originals[] = array($bundle->bundle_id=>array('name'=>$bundle->name, 
                                                         'internal_id'=>$bitstream->internal_id, 
                                                         'name'=>$bitstream->name,
                                                         'format'=>$format,   // get the 'human' format string
                                                         'mime'=>'extlink',
                                                         'bitstream'=>$bitstream,
                                                         )); 
          if ($count == 0) {
            $org = array('name'=>$bundle->name, 
                                 'internal_id'=>$bitstream->internal_id, 
                                 'name'=>$bitstream->name,
                                 'format'=>$format,   // get the 'human' format string
                                 'mime'=>'extlink',
                                 'bundle_id'=>$bundle->bundle_id,
                                ); 

          }
      }
    }


  }

  $ret = new apiResponse;

  $ret->item['dc_title'] = $item->dc_title;
  $ret->item['dc_description'] = $item->dc_description;

  $ret->originals = $originals;
  
  if (count($originals)>0) {
    $ret->original = $org;

  }
  // var_dump($ret);

  return Response::json($ret);

});

/**
 * Resources
 * browse
 * pass int pageSize
 */
Route::get('/', function () {
  return View::make('hello');

});


Route::get('/preview/{u?}/{id?}', function ($u = '', $id = '') {

  $uid = "$u/id";
  if ($id == '') {
    $uid = str_replace('jorum-10949-', 'jorum-10949/', $u);

  }

  $resource = \Bentleysoft\ES\Service::get($uid);

  if (!$resource) {
    App::abort(404);
  }

  if ($resource['_source']['admin']['source'] == 'jorum') {
    $object = MIMAS\Service\Jorum\Item::find(str_replace('jorum-', '', $uid), array('expand' => 'all'), 'json', 'json');
    $bitstreams = $object->getBitstreams();
  } elseif ($resource['_source']['admin']['source'] == 'ht') {

    $bitstream = new MIMAS\Service\Hairdressing\Bitstream();
    $bitstream->setBundleName('URL_BUNDLE');
    $bitstream->setName('http://hairdressing.ac.uk/'.str_replace('ht-', '', $resource['_id']));
    $bitstreams = array($bitstream);
  }

  $pUrl = MIMAS\Helpers::mainPreviewUrl($bitstreams);

  if (strpos('api/preview', $pUrl)!==false) {
    $bits = explode('/', $pUrl);
    $bitstreamId = $bits[count($bits)-1];

    $bitstream = MIMAS\Service\Jorum\Bitstream::find($bitstreamId, array(), 'json', 'json');

  } else {
    $bitstream = $bitstreams[0];
    foreach ($bitstreams as $b) {
      if ($b->getBundleName() == 'URL_BUNDLE') {
        $bitstream = $b;

      }
    }

  }



  if ($bitstream->getMimeType()=='application/zip') {
    return View::make('blankview')->with(array('bitstream'=>$bitstream));
  } else {
    return View::make('preview')->with(array('bitstream'=>$bitstream, 'purl'=>$pUrl));
  }

});


Route::any('xpreview/{id?}', function($id) {
  $bitstream = MIMAS\Service\Jorum\Bitstream::find($id, array(), 'json', 'json');
  if ($bitstream->getMimeType()=='application/zip') {
    return View::make('blankview')->with(array('bitstream'=>$bitstream));
  } else {
    return View::make('preview')->with(array('bitstream'=>$bitstream));
  }
});



  





















