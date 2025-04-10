# 基于 JSON Schema 进行属性类型和子属性查询的工具与方法

## 工具和库

### 1. JSONPath
JSONPath 是一种用于从 JSON 文档中提取特定部分的查询语言，可结合 JSON Schema 使用：

```javascript
const jp = require('jsonpath');
const schema = {
  "type": "object",
  "properties": {
    "user": {
      "type": "object",
      "properties": {
        "name": { "type": "string" },
        "age": { "type": "integer" }
      }
    },
    "products": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": { "type": "string" },
          "price": { "type": "number" }
        }
      }
    }
  }
};

// 查询所有字符串类型的属性
const stringProps = jp.query(schema, "$..properties[?(@.type=='string')]");
console.log(stringProps);
```

### 2. JSON Schema Traverse
专门用于遍历 JSON Schema 的库：

```javascript
const traverse = require('json-schema-traverse');

const schema = {/* 你的schema */};
const propertyTypes = {};

traverse(schema, {
  cb: function(schema, path) {
    if (schema.type && path.length > 0) {
      propertyTypes[path.join('.')] = schema.type;
    }
  }
});

console.log(propertyTypes); // 输出所有属性及其类型
```

### 3. JSON Schema Ref Parser
解析并处理 Schema 中的引用：

```javascript
const $RefParser = require('json-schema-ref-parser');

async function dereference() {
  try {
    // 解析引用，获得完整 schema
    const schema = await $RefParser.dereference('./schema.json');
    
    // 现在可以查询解析后的完整 schema
    // 查询所有必填属性
    const requiredProps = [];
    for (const key in schema.properties) {
      if (schema.required && schema.required.includes(key)) {
        requiredProps.push(key);
      }
    }
    
    console.log('必填属性:', requiredProps);
  } catch (err) {
    console.error(err);
  }
}

dereference();
```

### 4. Ajv 的元数据功能
Ajv 不仅可以验证数据，还可以提取 Schema 的元数据：

```javascript
const Ajv = require('ajv');
const ajv = new Ajv({meta: true});

const schema = {/* 你的schema */};
const validate = ajv.compile(schema);

// 访问编译后的 schema 元数据
console.log(validate.schema); // 原始 schema
console.log(validate.schema.properties.user.type); // 特定属性的类型
```

### 5. json-schema-tools
一组处理 JSON Schema 的工具集：
https://www.npmjs.com/package/@apidevtools/json-schema-ref-parser

```javascript
const { traverse } = require('@json-schema-tools/traverse');

const schema = {/* 你的schema */};

// 查找所有数值类型的属性
const numericProps = [];
traverse(schema, {
  traverseCallback: (s, path) => {
    if (s.type === 'number' || s.type === 'integer') {
      numericProps.push(path.join('.'));
    }
    return s;
  }
});

console.log('数值类型属性:', numericProps);
```

## 查询模式和实用技巧

### 1. 基于属性类型查询

```javascript
// 使用递归函数查找特定类型的属性
function findPropertiesByType(schema, type, path = '', result = {}) {
  if (!schema || typeof schema !== 'object') return result;
  
  if (schema.type === type && path) {
    result[path] = schema;
  }
  
  if (schema.properties) {
    for (const prop in schema.properties) {
      findPropertiesByType(
        schema.properties[prop], 
        type, 
        path ? `${path}.${prop}` : prop, 
        result
      );
    }
  }
  
  if (schema.items) {
    findPropertiesByType(
      schema.items, 
      type, 
      path ? `${path}[]` : '[]', 
      result
    );
  }
  
  return result;
}

// 查找所有字符串类型的属性
const stringProps = findPropertiesByType(schema, 'string');
console.log(stringProps);
```

### 2. 基于格式或模式查询

```javascript
// 查找所有格式为 email 的属性
function findPropertiesByFormat(schema, format, path = '', result = {}) {
  if (!schema || typeof schema !== 'object') return result;
  
  if (schema.format === format && path) {
    result[path] = schema;
  }
  
  // 递归处理对象属性和数组项
  // ...与上面类似的递归逻辑
  
  return result;
}

const emailProps = findPropertiesByFormat(schema, 'email');
```

### 3. 查询必填属性

```javascript
function findRequiredProperties(schema, path = '', result = []) {
  if (!schema || typeof schema !== 'object') return result;
  
  if (schema.required && Array.isArray(schema.required)) {
    for (const prop of schema.required) {
      result.push(path ? `${path}.${prop}` : prop);
    }
  }
  
  // 递归处理子属性
  if (schema.properties) {
    for (const prop in schema.properties) {
      findRequiredProperties(
        schema.properties[prop], 
        path ? `${path}.${prop}` : prop, 
        result
      );
    }
  }
  
  return result;
}
```

### 4. 可视化工具

#### JSON Schema Viewer
将 JSON Schema 以可视化方式展示，便于浏览属性结构：
- [JSON Schema Viewer](https://github.com/networknt/json-schema-viewer)

#### JSON Editor
基于 Schema 的 JSON 编辑器，可以浏览和编辑与 Schema 关联的数据：
- [JSON Editor](https://github.com/josdejong/jsoneditor)

## 应用场景实例

### 1. 创建智能表单生成器

```javascript
// 根据 schema 自动生成表单字段
function generateFormFields(schema) {
  const fields = [];
  
  for (const prop in schema.properties) {
    const propSchema = schema.properties[prop];
    const isRequired = schema.required && schema.required.includes(prop);
    
    fields.push({
      name: prop,
      label: propSchema.title || prop,
      type: getFieldType(propSchema),
      required: isRequired,
      options: propSchema.enum,
      validations: getValidations(propSchema)
    });
  }
  
  return fields;
}

function getFieldType(propSchema) {
  switch (propSchema.type) {
    case 'string':
      if (propSchema.format === 'date') return 'date';
      if (propSchema.format === 'email') return 'email';
      if (propSchema.enum) return 'select';
      return 'text';
    case 'number': return 'number';
    case 'boolean': return 'checkbox';
    case 'array': return 'multi-select';
    default: return 'text';
  }
}
```

### 2. 建立数据库映射

```javascript
// 从 Schema 生成数据库表结构
function schemaToDbSchema(schema, tableName) {
  const columns = [];
  
  for (const prop in schema.properties) {
    const propSchema = schema.properties[prop];
    
    columns.push({
      name: prop,
      type: getDbType(propSchema),
      nullable: !(schema.required && schema.required.includes(prop)),
      constraints: getConstraints(propSchema)
    });
  }
  
  return {
    table: tableName,
    columns: columns
  };
}

function getDbType(propSchema) {
  switch (propSchema.type) {
    case 'string': return propSchema.maxLength > 255 ? 'TEXT' : 'VARCHAR';
    case 'number': return propSchema.format === 'float' ? 'FLOAT' : 'INTEGER';
    case 'boolean': return 'BOOLEAN';
    case 'object': return 'JSON';
    case 'array': return 'JSON';
    default: return 'VARCHAR';
  }
}
```

### 3. 文档生成

```javascript
// 生成属性文档
function generatePropertyDocs(schema) {
  let markdown = '# API 属性文档\n\n';
  
  for (const prop in schema.properties) {
    const propSchema = schema.properties[prop];
    
    markdown += `## ${prop}\n\n`;
    markdown += `**类型**: ${propSchema.type}\n\n`;
    
    if (propSchema.description) {
      markdown += `**描述**: ${propSchema.description}\n\n`;
    }
    
    if (propSchema.enum) {
      markdown += '**可选值**:\n';
      propSchema.enum.forEach(val => {
        markdown += `- \`${val}\`\n`;
      });
      markdown += '\n';
    }
    
    // 添加更多属性信息...
  }
  
  return markdown;
}
```

## 实现自定义查询 API

如果您需要经常查询 Schema，可以创建专门的查询 API：

```javascript
class SchemaExplorer {
  constructor(schema) {
    this.schema = schema;
  }
  
  // 按类型查询属性
  findByType(type) {
    return this._traverse((schema, path) => schema.type === type, path);
  }
  
  // 按格式查询属性
  findByFormat(format) {
    return this._traverse((schema, path) => schema.format === format, path);
  }
  
  // 查询所有必填属性
  findRequired() {
    const result = [];
    this._traverseRequired(this.schema, '', result);
    return result;
  }
  
  // 查询指定路径的属性类型
  getTypeAt(path) {
    const parts = path.split('.');
    let current = this.schema;
    
    for (const part of parts) {
      if (part === '' || !current) return null;
      
      if (current.properties && current.properties[part]) {
        current = current.properties[part];
      } else {
        return null;
      }
    }
    
    return current.type;
  }
  
  // 通用遍历函数
  _traverse(predicate, path = '', result = {}) {
    // 实现遍历逻辑...
    return result;
  }
  
  _traverseRequired(schema, path, result) {
    // 实现必填属性遍历逻辑...
  }
}

// 使用示例
const explorer = new SchemaExplorer(mySchema);
const numberProps = explorer.findByType('number');
const emailProps = explorer.findByFormat('email');
const requiredProps = explorer.findRequired();
```

这些方法和工具可以帮助您有效地从 JSON Schema 中查询属性类型和子属性信息，适用于各种需要基于 Schema 结构进行操作的场景。
