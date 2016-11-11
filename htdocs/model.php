<?php

class Model {
    // Array for storing overrides
    private $data = [];

    // SECTION OVERRIDES
    public function __set($name, $value) {
        $this->data[$name] = $value;
    }

    public function __get($name) {
        if (array_key_exists($name, $this->data)) {
            return $this->data[$name];
        }
        return null;
    }

    public function __isset($name) {
        return isset($this->data[$name]);
    }

    public function __unset($name) {
        unset($this->data[$name]);
    }
    // ENDSECTION OVERRIDES

    // Return called class name
    public static function name() {
        return get_called_class();
    }

    // Create XML
    public static function createXML() {
        $root_tag = static::$xml_root;
        $xml = new SimpleXMLElement("<$root_tag></$root_tag>");
        $xml->asXML(static::$xml_dir);
    }

    // Return class data as JSON data
    public function list_contents() {
        echo "<pre>" . json_encode($this->data) . "</pre>";
    }

    // List all data keys in CSV
    private function list_keys() {
        $key_string = "";
        foreach (array_keys($this->data) as $key) {
            $key_string = empty($key_string) ?
                "$key" :
                "$key_string, $key";
        }
        return $key_string;
    }

    // Add an additional property
    public function set($name, $value) {
        $this->data[$name] = $value;
        return $this;
    }


    // Save instance based on $data
    public function save() {
        if (file_exists(static::$xml_dir)) {
            $xml = simplexml_load_file(static::$xml_dir);
            $node = $xml->addChild(static::$xml_child);
            foreach (array_keys($this->data) as $key) {
                $node->addChild($key, $this->data[$key]);
            }
            $xml->asXML(static::$xml_dir);
        } else {
            static::createXML();
        }
    }

    // Update current instance data
    public function update() {
        if (file_exists(static::$xml_dir)) {
            $xml = simplexml_load_file(static::$xml_dir);
            $index = 0;
            foreach ($xml->children() as $parent_key => $child) {
                if ($child->id == $this->data["id"]) {
                    foreach (array_keys($this->data) as $key) {
                        $xml->good[$index]->$key  = $this->data[$key];
                    }
                    $xml->asXML(static::$xml_dir);
                    return;
                }
                $index++;
            }
        } else {
            static::createXML();
        }
    }

    // Return a list of all returned model instances
    public static function all() {
        if (file_exists(static::$xml_dir)) {
            $models = [];
            $xml = simplexml_load_file(static::$xml_dir);
            foreach ($xml->children() as $parent_key => $child) {
                $class_name = static::name();
                $model = new $class_name;
                foreach ($child->children() as $key => $value) {
                    $value_array = (array) $value;
                    $model->$key = $value_array[0];
                }
                $models[] = $model;
            }
            return $models;
        } else {
            static::createXML();
        }
    }

    // Return a single model instance based on where clause
    public static function where($where_key, $where_value) {
        if (file_exists(static::$xml_dir)) {
            $xml = simplexml_load_file(static::$xml_dir);
            foreach ($xml->children() as $parent_key => $child) {
                $class_name = static::name();
                $model = new $class_name;
                foreach ($child->children() as $key => $value) {
                    $value_array = (array) $value;
                    $model->$key = $value_array[0];
                }
                // Return model if found
                if ($model->$where_key == $where_value) return $model;
            }
            return $models;
        } else {
            static::createXML();
        }
    }

    // Return a single model instance
    public static function find($id) {
        if (file_exists(static::$xml_dir)) {
            $xml = simplexml_load_file(static::$xml_dir);
            foreach ($xml->children() as $parent_key => $child) {
                $class_name = static::name();
                $model = new $class_name;
                foreach ($child->children() as $key => $value) {
                    $value_array = (array) $value;
                    $model->$key = $value_array[0];
                }
                // Return model if found
                if ($model->id == $id) return $model;
            }
            return $models;
        } else {
            static::createXML();
        }
    }

    // Delete instance based on id
    public static function delete($id) {
        if (file_exists(static::$xml_dir)) {
            $xml = simplexml_load_file(static::$xml_dir);
            $index = 0;
            foreach ($xml->children() as $parent_key => $child) {
                if ($child->id == $id) {
                    unset($xml->good[$index]);
                    $xml->asXML(static::$xml_dir);
                    return;
                }
                $index++;
            }
        } else {
            static::createXML();
        }
    }
}
