import type { ResDefault } from 'types/apis';

export default function response(success: boolean, data?: any) {
  const ret: ResDefault = { success };
  if (data) ret.data = data;
  return ret;
}
