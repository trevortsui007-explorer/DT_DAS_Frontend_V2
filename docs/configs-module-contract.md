# Configs Module Contract

## Frontend Standard Model

### 前端 features/configs 内统一使用以下字段

```ts
type FileConfigItem = {
  id: number
  name: string
  sourcePath: string
  targetTable: string
  fileType?: string
  isEnabled: boolean
  description?: string
  createTime?: string
  updateTime?: string
  fileNamePattern?: string
  headerRow?: number
  startRow?: number
  fieldMappings?: Record<string, string>
}
```

## Backend Raw Fields

### 当前后端字段

```txt
eqName -> name
filePathPattern -> sourcePath
tableName -> targetTable
fieldMappings string -> Record<string, string>
```

### API Adapter

字段转换统一放在：

`src/api/modules/configs.api.ts`

features 层禁止直接使用：

```txt
eqName
filePathPattern
tableName
```

fieldMappings

前端内部使用：

`Record<string, string>`

示例：

```json
{
  "文件路径": "filePath"
}
```

后端接口提交时使用 string：

```json
"{\"文件路径\":\"filePath\"}"
```

转换规则：

```txt
进入前端：JSON.parse
提交后端：JSON.stringify
```

## Main Flows

List
`GET /api/file-configs?all=true`

Detail
`GET /api/file-configs/{id}`

Create
`POST /api/file-configs`

Update
`PUT /api/file-configs/{id}`

Status
`PATCH /api/file-configs/status`