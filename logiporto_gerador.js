// mongosh --file logiporto_gerador.js
const RA = 260141592; // &lt;&lt;&lt; RA do aluno (somente dígitos, sem zeros à esquerda)
if (!RA) throw new Error(&quot;Defina o RA&quot;);
function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0;
let t = Math.imul(a ^ a &gt;&gt;&gt; 15, 1 | a); t = t + Math.imul(t ^ t &gt;&gt;&gt; 7, 61 | t) ^ t;
return ((t ^ t &gt;&gt;&gt; 14) &gt;&gt;&gt; 0) / 4294967296; }; }
const rand = mulberry32(RA);
const ri = (n) =&gt; Math.floor(rand() * n);
const pick = (a) =&gt; a[ri(a.length)];
const TERMINAIS = [&quot;T1&quot;, &quot;T2&quot;, &quot;T3&quot;, &quot;T4&quot;, &quot;T5&quot;];
const CLASSES = [&quot;Refrigerado&quot;, &quot;Perigoso&quot;, &quot;Granel&quot;, &quot;Geral&quot;];
const TIPOS = [&quot;gate_in&quot;, &quot;gate_out&quot;, &quot;inspecao&quot;, &quot;carga&quot;, &quot;descarga&quot;];
const TAGS = [&quot;refrigerado&quot;, &quot;perigoso&quot;, &quot;fragil&quot;, &quot;alto_valor&quot;, &quot;urgente&quot;,
&quot;inspecao_fiscal&quot;, &quot;granel&quot;, &quot;lacre_violado&quot;, &quot;transbordo&quot;, &quot;exportacao&quot;, &quot;importacao&quot;,
&quot;overweight&quot;];
const PALAVRAS = [&quot;lacre&quot;, &quot;guindaste&quot;, &quot;patio&quot;, &quot;fila&quot;, &quot;balanca&quot;, &quot;doca&quot;, &quot;navio&quot;,
&quot;carga&quot;, &quot;descarga&quot;, &quot;vistoria&quot;, &quot;atraso&quot;, &quot;liberado&quot;];
const CLASSE_ALVO = CLASSES[RA % 4];
const TERMINAL_ALVO = TERMINAIS[Math.floor(RA / 7) % 5];
const DATA_CORTE = new Date(Date.UTC(2026, 3 + (RA % 4), 1));
const PONTO_LAT = -25.50 + ((RA % 50) / 1000);
const PONTO_LON = -48.52 + ((Math.floor(RA / 3) % 50) / 1000);
db = db.getSiblingDB(&quot;logiporto&quot;);
db.movimentacoes.drop(); db.alertas.drop();
const INICIO = Date.UTC(2026, 0, 1);
const TOTAL = 400000;
for (let i = 0; i &lt; TOTAL; i += 20000) {
const lote = [];
for (let j = i; j &lt; Math.min(i + 20000, TOTAL); j++) {
const tags = Array.from({ length: 1 + ri(3) }, () =&gt; pick(TAGS));
const palavras = Array.from({ length: 8 }, () =&gt; pick(PALAVRAS));
if (ri(500) === 0) palavras.push(&quot;avaria&quot;);
lote.push({
container: &quot;CTN&quot; + String(ri(60000)).padStart(5, &quot;0&quot;),
tipo: pick(TIPOS), terminal: pick(TERMINAIS), classe: pick(CLASSES),
peso_kg: 1000 + ri(30000),
ts: new Date(INICIO + ri(300 * 86400000)),
posicao: { type: &quot;Point&quot;, coordinates: [-48.52 + rand() * 0.05, -25.50 + rand() *
0.05] },
tags: tags, obs: palavras.join(&quot; &quot;)
});
}
db.movimentacoes.insertMany(lote, { ordered: false });
}
const alertas = [];
for (let i = 0; i &lt; 100000; i++) {
alertas.push({ sensor: &quot;S&quot; + ri(500), nivel: pick([&quot;info&quot;, &quot;aviso&quot;, &quot;critico&quot;]),
registrado_em: new Date(INICIO + ri(300 * 86400000)).toISOString() }); // String de
propósito (armadilha da A3)
}
db.alertas.insertMany(alertas, { ordered: false });
const aut = db.movimentacoes.aggregate([
{ $match: { classe: CLASSE_ALVO, terminal: TERMINAL_ALVO } },
{ $group: { _id: null, n: { $sum: 1 }, kg: { $sum: &quot;$peso_kg&quot; } } }]).toArray()[0];
print(&quot;=== PARÂMETROS DA SUA PROVA ===&quot;);
print(&quot;CLASSE_ALVO : &quot; + CLASSE_ALVO);
print(&quot;TERMINAL_ALVO : &quot; + TERMINAL_ALVO);
print(&quot;DATA_CORTE : &quot; + DATA_CORTE.toISOString().slice(0, 10));
print(&quot;INCIDENTE (formato Google Maps &#39;lat, lon&#39;): &quot; + PONTO_LAT.toFixed(4) + &quot;, &quot; +
PONTO_LON.toFixed(4));
print(&quot;CÓDIGO DE AUTENTICIDADE: LP-&quot; + RA + &quot;-&quot; + aut.n + &quot;-&quot; + (aut.kg % 99991));