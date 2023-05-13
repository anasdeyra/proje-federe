import multiparty from "multiparty";
import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";

export default function uploadSupport(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const from = new multiparty.Form();

  from.parse(req, async (err, _fields, files) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: err });
    }
    let supports: { name: string; path: string }[] = [];

    for (const name in files) {
      if (Object.prototype.hasOwnProperty.call(files, name)) {
        const { path } = files[name][0];
        supports.push({ name, path: `/uploads/${name}` });
        fs.copyFile(path, `./public/uploads/${name}`, () => {});
      }
    }

    return res.json(supports);
  });
}

export const config = {
  api: {
    bodyParser: false,
  },
};
