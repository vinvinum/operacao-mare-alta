// mongosh --nodb --file grafo_gerador.js &gt; grafo.cypher
const RA = 260141592; // &lt;&lt;&lt; RA do aluno
if (!RA) throw new Error(&quot;Defina o RA&quot;);
function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0;
let t = Math.imul(a ^ a &gt;&gt;&gt; 15, 1 | a); t = t + Math.imul(t ^ t &gt;&gt;&gt; 7, 61 | t) ^ t;
return ((t ^ t &gt;&gt;&gt; 14) &gt;&gt;&gt; 0) / 4294967296; }; }
const rand = mulberry32(RA + 7919);
const ri = (n) =&gt; Math.floor(rand() * n);
const lit = (o) =&gt; JSON.stringify(o).replace(/&quot;(\w+)&quot;:/g, &quot;$1:&quot;);
const NE = 30, NC = 90, TERM = [&quot;T1&quot;, &quot;T2&quot;, &quot;T3&quot;, &quot;T4&quot;, &quot;T5&quot;], CL = [&quot;Refrigerado&quot;,
&quot;Perigoso&quot;, &quot;Granel&quot;, &quot;Geral&quot;];
const SANC = RA % NE;
const empresas = Array.from({ length: NE }, (_, i) =&gt; ({ cnpj: &quot;E&quot; + i, nome: &quot;Empresa
&quot; + i, sancionada: i === SANC }));
const socios = []; const vistos = new Set();
while (socios.length &lt; 45) { const a = ri(NE), b = ri(NE); const k = a + &quot;-&quot; + b;
if (a !== b &amp;&amp; !vistos.has(k)) { vistos.add(k); socios.push({ de: &quot;E&quot; + a, para: &quot;E&quot;
+ b, pct: 5 + ri(90) }); } }
const containers = Array.from({ length: NC }, (_, i) =&gt; ({ id: &quot;K&quot; + i, classe:
CL[ri(4)], dono: &quot;E&quot; + ri(NE) }));
containers[0].dono = &quot;E&quot; + SANC; containers[1].dono = &quot;E&quot; + SANC; containers[2].dono =
&quot;E&quot; + SANC;
const passagens = [];
containers.forEach(c =&gt; { for (let p = 0; p &lt; 2; p++) passagens.push({ id: c.id, term:
TERM[ri(5)],
data: &quot;2026-10-&quot; + String(1 + ri(30)).padStart(2, &quot;0&quot;) }); });
const pilhas = [];
for (let s = 0; s &lt; 15; s++) for (let n = 1; n &lt; 4; n++) pilhas.push({ topo: &quot;K&quot; + (4 *
s + n), base: &quot;K&quot; + (4 * s + n - 1) });
print(&quot;// BASE_DA_PILHA da sua prova: K&quot; + (4 * (RA % 15)) + &quot; | EMPRESA SANCIONADA: E&quot;
+ SANC);
print(&quot;UNWIND &quot; + lit(TERM.map(t =&gt; ({ nome: t }))) + &quot; AS t CREATE (:Terminal {nome:
t.nome});&quot;);
print(&quot;UNWIND &quot; + lit(empresas) + &quot; AS e CREATE (:Empresa {cnpj: e.cnpj, nome: e.nome,
sancionada: e.sancionada});&quot;);
print(&quot;UNWIND &quot; + lit(socios) + &quot; AS s MATCH (a:Empresa {cnpj: s.de}), (b:Empresa
{cnpj: s.para}) CREATE (a)-[:SOCIA_DE {pct: s.pct}]-&gt;(b);&quot;);
print(&quot;UNWIND &quot; + lit(containers) + &quot; AS c MATCH (e:Empresa {cnpj: c.dono}) CREATE
(:Container {id: c.id, classe: c.classe})-[:PERTENCE_A]-&gt;(e);&quot;);
print(&quot;UNWIND &quot; + lit(passagens) + &quot; AS p MATCH (k:Container {id: p.id}), (t:Terminal
{nome: p.term}) CREATE (k)-[:PASSOU_POR {data: p.data}]-&gt;(t);&quot;);
print(&quot;UNWIND &quot; + lit(pilhas) + &quot; AS p MATCH (a:Container {id: p.topo}), (b:Container
{id: p.base}) CREATE (a)-[:EMPILHADO_SOBRE]-&gt;(b);&quot;);