import { NextResponse } from "next/server";

const DB_HOST = process.env.DB_HOST || "127.0.0.1";
const DB_USER = process.env.ADMIN_DB_USER || "api_user";
const DB_PASS = process.env.ADMIN_DB_PASS || "Gguoshiqiang-1872631648";
const DB_NAME = process.env.ADMIN_DB_NAME || "new_api";

// 用 eval 绕过 webpack 静态模块解析
const loadMysql = () => eval("require")("mysql2/promise");

async function query(sql: string) {
  try {
    const mysql = loadMysql();
    const conn = await mysql.createConnection({
      host: DB_HOST, port: 3306, user: DB_USER, password: DB_PASS, database: DB_NAME,
    });
    const [rows] = await conn.execute(sql);
    await conn.end();
    return rows as Record<string, unknown>[];
  } catch {
    return [];
  }
}

export async function GET() {
  const [models, channels, prices, ratios] = await Promise.all([
    query("SELECT id, model_name as name, status, vendor_id, endpoints FROM models WHERE deleted_at IS NULL ORDER BY id"),
    query("SELECT id, name, status, models as model_list, model_mapping FROM channels WHERE status = 1"),
    query("SELECT `value` FROM options WHERE `key` = 'ModelPrice'"),
    query("SELECT `value` FROM options WHERE `key` = 'ModelRatio'"),
  ]);

  let modelPrices: Record<string, number> = {};
  let modelRatios: Record<string, number> = {};
  try { modelPrices = JSON.parse((prices[0] as any)?.value || "{}"); } catch { /* empty */ }
  try { modelRatios = JSON.parse((ratios[0] as any)?.value || "{}"); } catch { /* empty */ }

  return NextResponse.json({ models, channels, modelPrices, modelRatios });
}
