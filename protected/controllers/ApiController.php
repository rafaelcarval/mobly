<?php
class ApiController extends Controller
{
    
    Const APPLICATION_ID = 'ASCCPE';
 
    /**
     * Default response format
     * either 'json' or 'xml'
     */
    private $format = 'json';
    /**
     * @return array action filters
     */
    public function filters()
    {
            return array();
    }
 
    // Actions
    public function actionCategory()
    {        
        $arrayCategory = array();
        $model = MB_CATEGORY::model()->findAll();
        foreach ($model as $row) {
            $arrayCategory[$row['id']]['id'] = $row['id'];
            $arrayCategory[$row['id']]['name'] = $row['name'];
        }        

        echo json_encode($arrayCategory);
    }
    public function actionGetCategoryId()
    {        
        $arrayCategory = array();
        $id = Yii::app()->request->getParam('id');
        $model = MB_CATEGORY::model()->find('id=:id', array(':id'=>$id));    
        
        $arrayCategory[0]['id'] = $model['id'];
        $arrayCategory[0]['name'] = $model['name'];         

        echo json_encode($arrayCategory);
    }
    public function actionGetCharacteristicsId()
    {
        $arrayCharacteristics = array();
        $id = Yii::app()->request->getParam('id');
        $model = MB_CHARACTERISTICS::model()->find('id=:id', array(':id'=>$id));    
        
        $arrayCharacteristics[0]['id'] = $model['id'];
        $arrayCharacteristics[0]['name'] = $model['name'];         

        echo json_encode($arrayCharacteristics);
    }
    public function actionProduct()
    {
        $arrayProduct = array();
        $model = MB_PRODUCT::model()->findAll();
        foreach ($model as $row) {    
            $arrayCategory = array();
            $model_prod_cat = MB_PRODUCT_CATEGORY::model()->findall('product_id=:product_id', array(':product_id'=>$row->id));

            foreach ($model_prod_cat as $row_prod_cat) {                
                $model_cat = MB_CATEGORY::model()->findall('id=:id', array(':id'=>$row_prod_cat->category_id));
                $arrayCategory[] = array(
                    'id' => $model_cat[0]->id,
                    'name' => $model_cat[0]->name,                
                );  
            }

            $model_prod_cha = MB_CHARACTERISTICS::model()->findall('product_id=:product_id', array(':product_id'=>1));

            $arrayProduct[] = array(
                'id' => $row->id,
                'name' => $row->name,
                'description' => $row->description,
                'image' => $row->image,
                'price' => $row->price,
                'category' => $arrayCategory,    
                'state' => false,
                'text' => 'adicionar', 
                'characteristics' => $model_prod_cha[0]->characteristics,             
            );
        }        

        echo json_encode($arrayProduct);
    }
    public function actionGetProductId()
    {
        $arrayProduct = array();
        $id = Yii::app()->request->getParam('id');
        $model = MB_CHARACTERISTICS::model()->find('id=:id', array(':id'=>$id));
        $arrayProduct[0]['id'] = $row['id'];
        $arrayProduct[0]['name'] = $row['name'];
        $arrayProduct[0]['description'] = $row['description'];
        $arrayProduct[0]['image'] = $row['image'];
        $arrayProduct[0]['price'] = $row['price'];    

        echo json_encode($arrayProduct);
    }
    public function actionGetProductCategoryId()
    {
        $arrayProductCategory = array();
        $id = Yii::app()->request->getParam('id');
        $fild = Yii::app()->request->getParam('fild');
        if(!isset($fild)){
            $fild = 'product_id';
        }
        $model = MB_PRODUCT_CATEGORY::model()->find($fild.'=:id', array(':id'=>$id));
        $arrayProductCategory[0]['id'] = $model['id'];
        $arrayProductCategory[0]['product_id'] = $model['product_id'];
        $arrayProductCategory[0]['category_id'] = $model['category_id'];

        echo json_encode($arrayProductCategory);
    }
    public function actionSetShoppingCart()
    {
        $id = Yii::app()->request->getParam('id');
        $qtd = Yii::app()->request->getParam('qtd');
        $price = Yii::app()->request->getParam('price');
        $indice = Yii::app()->request->getParam('indice');
        
        if(Yii::app()->user->hasState("carrinho") == false){
            Yii::app()->user->setState("carrinho",array());
            $carrinho = Yii::app()->user->getState("carrinho");
        }else{
            $carrinho = Yii::app()->user->getState("carrinho");
        }
        

        $model = MB_PRODUCT::model()->findall('id=:id', array(':id'=>$id));
        
        
        if(array_key_exists($indice,$carrinho)){
            $carrinho[$indice]['qtd'] = $qtd;
            Yii::app()->user->setState("carrinho",$carrinho);
        }else{            
            $carrinho[] = array(
                'id' => $id,
                'price' => $price,
                'qtd' => $qtd,
                'description' => $model[0]['description'],
                'name' => $model[0]['name'],
                'image' => $model[0]['image'],
            );
            Yii::app()->user->setState("carrinho",$carrinho);
        }      
        

    }
    public function actionGetShoppingCart()
    {        
        echo json_encode(Yii::app()->user->getState("carrinho"));
    }
    public function actionRemoveItem()
    {
        $indice = Yii::app()->request->getParam('indice');
        $carrinho = Yii::app()->user->getState("carrinho");
        unset($carrinho[$indice]);
        sort($carrinho);
        Yii::app()->user->setState("carrinho",$carrinho);
        echo json_encode(Yii::app()->user->getState("carrinho"));
    }

    public function actionLogout()
    {
        Yii::app()->user->logout();
    }

    public function actionSetPedido()
    {
        
        $usuario = Yii::app()->user->getState("usuario");
        $carrinho = Yii::app()->user->getState("carrinho");        

        $total_value = 0;
        $discount = 0;
        $amount = 0;

        foreach ($carrinho as $row) {
            $total_value += $row['price']*$row['qtd'];
            $amount += $row['qtd'];
        }

        $pedido = new MB_SHOPPING_CART;
        $pedido->user_id = $usuario['id'];
        $pedido->value = $total_value;
        $pedido->discount = $discount;
        $pedido->total_value = $total_value;
        $pedido->save();
        $idPedido = $pedido->id;

        foreach ($carrinho as $row) {
            $pedidoItem = new MB_SHOPPING_CART_ITENS;

            $pedidoItem->shopping_cart_id = $idPedido;
            $pedidoItem->product_id = $row['id'];
            $pedidoItem->amount = $row['qtd'];
            $pedidoItem->unit_price = $row['price'];
            $pedidoItem->total_price = $row['price'] * $row['qtd'];
            $pedidoItem->save();
        }

        Yii::app()->user->setState("carrinho",array());

        $message = array('message'=>'sucesso','idPedido'=>$idPedido);

        echo json_encode($message);

    }
    public function actionGetPedido()
    {
        $idPedido = Yii::app()->request->getParam('idPedido');

        $modelPedido = MB_SHOPPING_CART::model()->findall('id=:id', array(':id'=>$idPedido));

        $modelItens = MB_SHOPPING_CART_ITENS::model()->findall('shopping_cart_id=:shopping_cart_id', array(':shopping_cart_id'=>$idPedido));

        foreach ($modelItens as $row) {
            $modelProd = MB_PRODUCT::model()->findall('id=:id', array(':id'=>$row->product_id));

            $arrayItens[] = array(
                'id' =>  $row->id,
                'shopping_cart_id' =>  $row->shopping_cart_id,
                'product_id' =>  $row->product_id,
                'qtd' =>  $row->amount,
                'price' =>  $row->unit_price, 
                'name' =>  $modelProd[0]->name, 
                'description' =>  $modelProd[0]->description,  
                'image' =>  $modelProd[0]->image,           
            );  
        }

        $pedidoFinal = array(
            'id' => $modelPedido[0]['id'],
            'user_id' => $modelPedido[0]['user_id'],
            'value' => $modelPedido[0]['value'],
            'discount' => $modelPedido[0]['discount'],
            'total_value' => $modelPedido[0]['total_value'],
            'itens' => $arrayItens,
            );
        //var_dump($pedidoFinal);
        echo json_encode($pedidoFinal);
    }
    public function actionGetUser()
    {

        if(Yii::app()->user->hasState("usuario") == false){
            Yii::app()->user->setState("usuario",array());
            $usuario = Yii::app()->user->getState("usuario");

            $login = Yii::app()->request->getParam('login');
            $password = Yii::app()->request->getParam('password');

            $criteria = new CDbCriteria;
            $criteria->condition = 'login = "'.$login.'" and password = "'.$password.'"';

            $model = MB_USERS::model()->findAll($criteria);

            $usuario = array(
                    'id' => $model[0]['id'],
                    'name' => $model[0]['name'],
                    'last_name' => $model[0]['last_name'],
                    'gender' => $model[0]['gender'],
                    'street' => $model[0]['street'],
                    'number' => $model[0]['number'],
                    'complement' => $model[0]['complement'],
                    'neighborhood' => $model[0]['neighborhood'],
                    'city' => $model[0]['city'],
                    'state' => $model[0]['state'],
                    'country' => $model[0]['country'],
                    'phone_ddd' => $model[0]['phone_ddd'],
                    'phone' => $model[0]['phone'],
                    'celphone_ddd' => $model[0]['celphone_ddd'],
                    'celphone' => $model[0]['celphone'],
                    'email' => $model[0]['email'],
                    'login' => $model[0]['login'],
                    'password' => $model[0]['password'],
                );

            Yii::app()->user->setState("usuario",$usuario);
        }else{
            $usuario = Yii::app()->user->getState("usuario");
            ;
            if (count($usuario) == 0) {
                $login = Yii::app()->request->getParam('login');
                $password = Yii::app()->request->getParam('password');

                $criteria = new CDbCriteria;
                $criteria->condition = 'login = "'.$login.'" and password = "'.$password.'"';

                $model = MB_USERS::model()->findAll($criteria);

                $usuario = array(
                        'id' => $model[0]['id'],
                        'name' => $model[0]['name'],
                        'last_name' => $model[0]['last_name'],
                        'gender' => $model[0]['gender'],
                        'street' => $model[0]['street'],
                        'number' => $model[0]['number'],
                        'complement' => $model[0]['complement'],
                        'neighborhood' => $model[0]['neighborhood'],
                        'city' => $model[0]['city'],
                        'state' => $model[0]['state'],
                        'country' => $model[0]['country'],
                        'phone_ddd' => $model[0]['phone_ddd'],
                        'phone' => $model[0]['phone'],
                        'celphone_ddd' => $model[0]['celphone_ddd'],
                        'celphone' => $model[0]['celphone'],
                        'email' => $model[0]['email'],
                        'login' => $model[0]['login'],
                        'password' => $model[0]['password'],
                    );

                Yii::app()->user->setState("usuario",$usuario);
            }
        }
        
        echo json_encode(Yii::app()->user->getState("usuario"));
    }

    private function _sendResponse($status = 200, $body = '', $content_type = 'text/html')
    {
        // set the status
        $status_header = 'HTTP/1.1 ' . $status . ' ' . $this->_getStatusCodeMessage($status);
        header($status_header);
        // and the content type
        header('Content-type: ' . $content_type);
     
        // pages with body are easy
        if($body != '')
        {
            // send the body
            echo $body;
        }
        // we need to create the body if none is passed
        else
        {
            // create some body messages
            $message = '';
     
            // this is purely optional, but makes the pages a little nicer to read
            // for your users.  Since you won't likely send a lot of different status codes,
            // this also shouldn't be too ponderous to maintain
            switch($status)
            {
                case 401:
                    $message = 'You must be authorized to view this page.';
                    break;
                case 404:
                    $message = 'The requested URL ' . $_SERVER['REQUEST_URI'] . ' was not found.';
                    break;
                case 500:
                    $message = 'The server encountered an error processing your request.';
                    break;
                case 501:
                    $message = 'The requested method is not implemented.';
                    break;
            }
     
            // servers don't always have a signature turned on 
            // (this is an apache directive "ServerSignature On")
            $signature = ($_SERVER['SERVER_SIGNATURE'] == '') ? $_SERVER['SERVER_SOFTWARE'] . ' Server at ' . $_SERVER['SERVER_NAME'] . ' Port ' . $_SERVER['SERVER_PORT'] : $_SERVER['SERVER_SIGNATURE'];
     
            // this should be templated in a real-world solution
            $body = '
    <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
    <html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
        <title>' . $status . ' ' . $this->_getStatusCodeMessage($status) . '</title>
    </head>
    <body>
        <h1>' . $this->_getStatusCodeMessage($status) . '</h1>
        <p>' . $message . '</p>
        <hr />
        <address>' . $signature . '</address>
    </body>
    </html>';
     
            echo $body;
        }
        Yii::app()->end();
    }

    private function _getStatusCodeMessage($status)
    {
        // these could be stored in a .ini file and loaded
        // via parse_ini_file()... however, this will suffice
        // for an example
        $codes = Array(
            200 => 'OK',
            400 => 'Bad Request',
            401 => 'Unauthorized',
            402 => 'Payment Required',
            403 => 'Forbidden',
            404 => 'Not Found',
            500 => 'Internal Server Error',
            501 => 'Not Implemented',
        );
        return (isset($codes[$status])) ? $codes[$status] : '';
    }
}