export default [`
  type ImageUpload {
    uploadUrl: String
    imageUrl: String
  }
`, `
  extend type Mutation {
    signedUrl(type: String): ImageUpload
  }
`];
