/**
 * 文章数据模块
 * 将文章内容直接存储在代码中，避免Vercel部署时的文件系统问题
 */

export interface Post {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  publishDate: string;
  slug: string;
}

// 文章数据
export const posts: Post[] = [
  {
    id: 1,
    title: "网盘的数据安全与隐私保护｜站长深度指南",
    slug: "1.html",
    excerpt: "深入解析网盘安全风险，提供实用的隐私保护策略，让你的数字资产更安全。",
    author: "本站站长",
    publishDate: "2025年9月26日",
    content: `<div class="post-content">
  <p><strong>作者：</strong>本站站长<br/><strong>发布日期：</strong>2025年9月26日</p>

  <img src="https://images.unsplash.com/photo-1563013544-8ba73ffc74ee?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80" alt="数据安全与隐私保护" />

  <p>大家好，我是本站站长。</p>

  <p>每天都有读者问我："<strong>网盘到底安不安全？我的照片、合同、私人文件会不会被泄露？</strong>"</p>

  <p>今天，我将以技术从业者的视角，为你揭开网盘安全的真相，并分享<strong>实用的隐私保护策略</strong>，让你在享受便利的同时，牢牢守住自己的数字资产。</p>

  <h2>一、网盘的三大安全风险</h2>

  <p>首先，我们必须正视现实：没有任何系统是绝对安全的。网盘的主要风险包括：</p>

  <h3>1. 平台内部访问风险</h3>
  <p>你的文件上传后，存储在服务商的服务器上。理论上，平台的技术人员或内部系统可能有权限访问你的数据。</p>

  <h3>2. 数据泄露事件</h3>
  <p>历史上多次发生网盘公司数据库泄露事件（如用户名、密码、文件名等），导致用户信息外泄。</p>

  <h3>3. 第三方共享滥用</h3>
  <p>你分享的链接可能被他人转发、搜索引擎收录，甚至进入黑产交易市场，造成隐私曝光。</p>

  <div class="warning">
    ⚠️ 真实案例：某用户将身份证扫描件上传至网盘并生成分享链接，该链接被爬虫抓取并出现在非法网站上。
  </div>

  <h2>二、网盘是如何"保护"你数据的？</h2>

  <p>主流网盘通常采用以下技术手段保障安全：</p>

  <table>
    <tr>
      <th>技术</th>
      <th>说明</th>
      <th>局限性</th>
    </tr>
    <tr>
      <td>HTTPS 传输加密</td>
      <td>上传下载时数据加密，防窃听</td>
      <td>仅保护传输过程，不保护存储</td>
    </tr>
    <tr>
      <td>服务器存储加密</td>
      <td>文件在硬盘上以加密形式存储</td>
      <td>密钥由平台控制，仍可解密</td>
    </tr>
    <tr>
      <td>访问权限控制</td>
      <td>密码、有效期、提取码等</td>
      <td>依赖用户设置，易误操作</td>
    </tr>
  </table>

  <p>但请注意：这些措施大多是<strong>平台可控的加密</strong>，意味着服务商有能力查看你的内容。</p>

  <div class="tip">
    💡 关键区别：
    <ul>
      <li><strong>平台加密</strong>：服务商掌握密钥 → 可查看内容</li>
      <li><strong>客户端加密</strong>：你自己掌握密钥 → 连平台也无法查看（推荐！）</li>
    </ul>
  </div>

  <h2>三、站长推荐：5大隐私保护实战策略</h2>

  <p>不要被动依赖平台！以下是我在实际使用中总结的<strong>主动防护方法</strong>：</p>

  <h3>1. 敏感文件先加密再上传（强烈推荐）</h3>
  <p>使用工具如 <code>7-Zip</code>、<code>WinRAR</code> 或 <code>VeraCrypt</code> 将重要文件打包加密，设置强密码后再上传网盘。</p>
  <div class="highlight">✅ 优势：即使网盘被入侵，你的文件仍是密文。</div>

  <h3>2. 谨慎使用"分享"功能</h3>
  <ul>
    <li>避免分享含隐私信息的文件（如身份证、账单）。</li>
    <li>必须分享时，启用<strong>提取码 + 有效期</strong>。</li>
    <li>定期清理过期的分享链接。</li>
  </ul>

  <h3>3. 启用双重验证（2FA）</h3>
  <p>为你的网盘账户开启手机验证码或身份验证器（如 Google Authenticator），防止账号被盗。</p>

  <h3>4. 定期检查登录设备</h3>
  <p>大多数网盘提供"登录设备管理"，定期查看并踢出陌生设备。</p>

  <h3>5. 考虑使用端到端加密网盘</h3>
  <p>选择真正支持端到端加密的服务，如：</p>
  <ul>
    <li><strong>Tresorit</strong>：企业级安全，价格较高。</li>
    <li><strong>Sync.com</strong>：个人用户友好，免费版有限额。</li>
    <li><strong>坚果云（可选加密）</strong>：国内可用，支持客户端加密。</li>
  </ul>

  <div class="tip">
    📌 站长建议：普通文件用百度/阿里网盘；敏感文件务必本地加密或使用专用加密网盘。
  </div>
</div>`
  },
  {
    id: 2,
    title: "网盘如何与AI、区块链等技术结合？站长前沿解析",
    slug: "2.html",
    excerpt: "探索网盘与AI、区块链、云计算等前沿技术的深度融合，了解全新的应用场景。",
    author: "本站站长",
    publishDate: "2025年9月26日",
    content: `<div class="post-content">
  <p><strong>作者：</strong>本站站长<br/><strong>发布日期：</strong>2025年9月26日</p>

  <img src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80" alt="网盘与新技术融合" />

  <p>大家好，我是本站站长。</p>

  <p>过去我们只把网盘当作"网络U盘"，但随着技术发展，它早已不再孤立存在。</p>

  <p>今天，我将带大家看看：<strong>现代网盘是如何与AI、区块链、云计算等前沿技术深度融合的</strong>，这些结合不仅提升了体验，更催生了全新的应用场景。</p>

  <h2>一、网盘 + 人工智能（AI）：让文件"自己会思考"</h2>

  <div class="integration">
    🤖 智能分类、搜索、生成 —— AI 正在重塑网盘体验。
  </div>

  <h3>1. 智能内容识别</h3>
  <p>通过AI图像识别，网盘可自动：</p>
  <ul>
    <li>识别照片中的人物、场景、物体（如"猫"、"海滩"、"会议"）。</li>
    <li>自动生成相册（如"2024年北京旅行"）。</li>
    <li>支持"搜图"功能：输入"红色汽车"即可找到相关图片。</li>
  </ul>

  <h3>2. 语音与文档智能处理</h3>
  <p>上传一段录音或PDF，AI可自动：</p>
  <ul>
    <li>转写语音为文字（语音笔记 → 文本）。</li>
    <li>提取PDF中的关键信息（合同金额、日期等）。</li>
    <li>生成摘要或翻译内容。</li>
  </ul>

  <h3>3. 智能推荐与清理</h3>
  <p>AI分析你的使用习惯后：</p>
  <ul>
    <li>推荐你可能需要的旧文件。</li>
    <li>提示"长时间未访问的大文件"建议归档或删除。</li>
    <li>识别重复文件并建议去重。</li>
  </ul>

  <div class="highlight">站长实测：百度网盘的"AI成片"功能可自动剪辑旅行视频，准确率超80%。</div>

  <h2>二、网盘 + 区块链：打造真正去中心化存储</h2>

  <div class="integration">
    ⛓️ 去中心化、不可篡改 —— 区块链让数据归属回归用户。
  </div>

  <p>传统网盘是"中心化"的，而区块链技术正在改变这一模式：</p>

  <h3>代表项目：</h3>
  <ul>
    <li><strong>Filecoin</strong>：基于IPFS协议，用户可出租硬盘空间赚取FIL代币，他人付费存储文件。</li>
    <li><strong>Arweave</strong>：宣称"一次付费，永久存储"，适合存证、档案。</li>
    <li><strong>Storj</strong>：企业级去中心化云存储，支持S3兼容接口。</li>
  </ul>

  <h3>核心优势：</h3>
  <ul>
    <li><strong>抗审查</strong>：没有单一机构能删除你的文件。</li>
    <li><strong>高冗余</strong>：文件被加密分片，存储在全球多个节点。</li>
    <li><strong>成本低</strong>：利用闲置硬盘资源，价格低于传统云存储。</li>
  </ul>

  <div class="tip">💡 站长观点：去中心化网盘适合长期存档、版权作品备份，但速度和易用性仍需提升。</div>

  <h2>三、网盘 + 云计算：无缝集成生产力工具</h2>

  <div class="integration">
    ☁️ 存储即服务 —— 网盘成为云端工作流的核心枢纽。
  </div>

  <p>现代网盘已深度融入云计算生态：</p>

  <h3>1. 在线协作办公</h3>
  <p>文件无需下载，直接在浏览器中使用：</p>
  <ul>
    <li>腾讯文档、金山文档在线编辑 Word/Excel/PPT。</li>
    <li>石墨文档实时协作写笔记。</li>
    <li>Canva 在线设计海报。</li>
  </ul>

  <h3>2. 开发者集成（API）</h3>
  <p>企业可通过 API 将网盘接入自有系统：</p>
  <ul>
    <li>客户上传资料 → 自动存入企业网盘 → 触发审批流程。</li>
    <li>APP用户头像 → 直接上传至网盘CDN → 全球加速访问。</li>
  </ul>

  <h3>3. 与云服务器联动</h3>
  <p>阿里云、腾讯云等提供"云盘"服务，可挂载到云服务器，实现：</p>
  <ul>
    <li>网站附件存储分离。</li>
    <li>数据库备份自动上传。</li>
    <li>跨服务器文件共享。</li>
  </ul>

  <div class="highlight">站长案例：某电商系统用网盘API实现"订单截图自动归档"，节省人力90%。</div>
</div>`
  },
  {
    id: 3,
    title: "网盘的行业发展与竞争态势",
    slug: "3.html",
    excerpt: "深度解析网盘行业的发展历程、竞争格局和未来趋势，了解各大厂商的战略布局。",
    author: "本站站长",
    publishDate: "2025年9月27日",
    content: `<div class="post-content">
  <p><strong>作者：</strong>本站站长<br/><strong>发布日期：</strong>2025年9月27日</p>

  <img src="https://images.unsplash.com/photo-1451187580459-4349020c0eb9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80" alt="网盘行业竞争" />

  <p>大家好，我是本站站长。</p>

  <p>从2000年代初期的网络硬盘，到今天的云存储服务，网盘行业经历了翻天覆地的变化。</p>

  <p>今天，我将为大家深度解析<strong>网盘行业的发展历程、竞争格局和未来趋势</strong>，让你了解这个千亿级市场的前世今生。</p>

  <h2>一、网盘行业发展历程</h2>

  <h3>1. 萌芽期（2005-2010年）</h3>
  <ul>
    <li><strong>代表产品</strong>：网易网盘、QQ网络硬盘</li>
    <li><strong>特点</strong>：容量小（几十MB）、功能简单、主要用于文件中转</li>
    <li><strong>商业模式</strong>：免费为主，作为邮箱或IM工具的附属功能</li>
  </ul>

  <h3>2. 爆发期（2011-2016年）</h3>
  <ul>
    <li><strong>代表产品</strong>：115网盘、华为网盘、迅雷快传、360云盘</li>
    <li><strong>特点</strong>：容量大幅提升（GB级别）、开始支持多平台同步</li>
    <li><strong>重大事件</strong>：2013年各大厂商开始"空间大战"，免费送TB级空间</li>
  </ul>

  <h3>3. 洗牌期（2016-2018年）</h3>
  <div class="warning">
    ⚠️ 2016年被称为"网盘倒闭年"，超过20家网盘服务商关停或转型
  </div>
  <ul>
    <li><strong>关停潮</strong>：360云盘、UC网盘、新浪微盘等相继关闭</li>
    <li><strong>原因</strong>：版权压力、监管要求、盈利模式不清晰</li>
    <li><strong>幸存者</strong>：百度网盘、腾讯微云等头部厂商</li>
  </ul>

  <h3>4. 成熟期（2019年至今）</h3>
  <ul>
    <li><strong>市场格局</strong>：百度网盘一家独大，其他厂商差异化竞争</li>
    <li><strong>新进入者</strong>：阿里云盘、夸克网盘等新兴势力</li>
    <li><strong>趋势</strong>：从免费向付费转型，会员服务成为主要收入来源</li>
  </ul>

  <h2>二、当前竞争格局分析</h2>

  <h3>第一梯队：市场领导者</h3>
  <table>
    <tr>
      <th>产品</th>
      <th>市场份额</th>
      <th>核心优势</th>
      <th>主要挑战</th>
    </tr>
    <tr>
      <td><strong>百度网盘</strong></td>
      <td>约80%</td>
      <td>用户基数大、内容丰富、生态完善</td>
      <td>下载速度限制、用户体验争议</td>
    </tr>
  </table>

  <h3>第二梯队：差异化竞争者</h3>
  <ul>
    <li><strong>腾讯微云</strong>：与微信、QQ深度集成，主打社交分享</li>
    <li><strong>阿里云盘</strong>：不限速策略，主打极速体验</li>
    <li><strong>天翼云盘</strong>：运营商背景，主打安全可靠</li>
  </ul>

  <h3>第三梯队：垂直领域玩家</h3>
  <ul>
    <li><strong>坚果云</strong>：主打同步协作，面向办公人群</li>
    <li><strong>OneDrive</strong>：微软生态，Office深度集成</li>
    <li><strong>iCloud</strong>：苹果生态，设备无缝同步</li>
  </ul>

  <h2>三、商业模式演进</h2>

  <h3>1. 免费模式（2011-2018年）</h3>
  <p><strong>策略</strong>：通过免费空间吸引用户，再通过广告、增值服务变现</p>
  <p><strong>问题</strong>：带宽成本高昂，盈利模式不清晰</p>

  <h3>2. 付费会员模式（2018年至今）</h3>
  <p><strong>核心服务</strong>：</p>
  <ul>
    <li><strong>空间扩容</strong>：从免费2TB到会员6TB甚至无限空间</li>
    <li><strong>速度提升</strong>：解除下载速度限制，提供极速下载</li>
    <li><strong>功能增强</strong>：在线解压、大文件上传、批量操作等</li>
  </ul>

  <h3>3. 企业服务市场</h3>
  <p><strong>新兴方向</strong>：</p>
  <ul>
    <li><strong>企业网盘</strong>：团队协作、权限管理、安全保障</li>
    <li><strong>SaaS集成</strong>：与OA、CRM等业务系统深度整合</li>
    <li><strong>行业解决方案</strong>：针对教育、医疗、金融等行业的专业方案</li>
  </ul>

  <h2>四、未来发展趋势</h2>

  <h3>1. 技术趋势</h3>
  <ul>
    <li><strong>AI深度集成</strong>：智能分类、内容识别、个性化推荐</li>
    <li><strong>边缘计算</strong>：就近存储和访问，提升访问速度</li>
    <li><strong>隐私计算</strong>：端到端加密，保护用户隐私</li>
  </ul>

  <h3>2. 市场趋势</h3>
  <ul>
    <li><strong>付费率提升</strong>：用户逐渐接受为优质服务付费</li>
    <li><strong>企业服务增长</strong>：数字化转型推动企业云存储需求</li>
    <li><strong>生态化发展</strong>：从单一存储向综合云服务转型</li>
  </ul>

  <h3>3. 监管趋势</h3>
  <ul>
    <li><strong>内容审核加强</strong>：版权保护、内容安全要求提高</li>
    <li><strong>数据本地化</strong>：重要数据必须存储在境内</li>
    <li><strong>隐私保护</strong>：个人信息保护法规日趋严格</li>
  </ul>

  <div class="tip">
    📌 站长预测：未来3-5年，网盘行业将进入"存量竞争"阶段，服务质量、用户体验和生态整合将成为制胜关键。
  </div>

  <h2>五、用户选择建议</h2>

  <h3>个人用户</h3>
  <ul>
    <li><strong>大容量需求</strong>：百度网盘（资源丰富，但需接受速度限制）</li>
    <li><strong>极速体验</strong>：阿里云盘（不限速，但资源相对较少）</li>
    <li><strong>办公协作</strong>：腾讯微云或坚果云（同步功能强）</li>
  </ul>

  <h3>企业用户</h3>
  <ul>
    <li><strong>安全可靠</strong>：天翼云盘或运营商产品</li>
    <li><strong>生态整合</strong>：阿里云盘或腾讯云</li>
    <li><strong>专业服务</strong>：坚果云或垂直领域专业产品</li>
  </ul>
</div>`
  },
  {
    id: 4,
    title: "网盘的使用技巧与方法",
    slug: "4.html",
    excerpt: "分享网盘高效使用的实用技巧，包括文件管理、分享设置、速度优化等进阶操作方法。",
    author: "本站站长",
    publishDate: "2025年9月28日",
    content: `<div class="post-content">
  <p><strong>作者：</strong>本站站长<br/><strong>发布日期：</strong>2025年9月28日</p>

  <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80" alt="网盘使用技巧" />

  <p>大家好，我是本站站长。</p>

  <p>很多朋友问我："网盘到底该怎么用才高效？为什么我总觉得用起来很费劲？"</p>

  <p>今天，我将分享<strong>多年积累的网盘使用技巧与方法</strong>，从基础操作到进阶技巧，让你彻底掌握网盘的高效使用之道。</p>

  <h2>一、文件管理技巧</h2>

  <h3>1. 科学的文件夹结构</h3>
  <p><strong>推荐结构</strong>：</p>
  <div class="highlight">
    📁 网盘根目录/<br/>
    &nbsp;&nbsp;├─ 📁 01-工作文档/<br/>
    &nbsp;&nbsp;│&nbsp;&nbsp;├─ 📁 2024年/<br/>
    &nbsp;&nbsp;│&nbsp;&nbsp;└─ 📁 2025年/<br/>
    &nbsp;&nbsp;├─ 📁 02-学习资料/<br/>
    &nbsp;&nbsp;├─ 📁 03-生活照片/<br/>
    &nbsp;&nbsp;├─ 📁 04-软件备份/<br/>
    &nbsp;&nbsp;└─ 📁 05-临时文件/
  </div>

  <h3>2. 文件命名规范</h3>
  <p><strong>推荐格式</strong>：</p>
  <ul>
    <li><strong>日期型</strong>：2025-09-28_项目报告_v1.2.docx</li>
    <li><strong>分类型</strong>：合同_房屋租赁_2025_甲方版.pdf</li>
    <li><strong>版本型</strong>：产品设计_最终版_20250928.sketch</li>
  </ul>

  <div class="tip">
    💡 小技巧：在文件名前加数字前缀可以控制排序，如"01-重要文件"、"02-一般文件"
  </div>

  <h3>3. 标签和备注功能</h3>
  <p><strong>应用场景</strong>：</p>
  <ul>
    <li>给重要文件加"⭐重要"标签</li>
    <li>给待处理文件加"📋待办"标签</li>
    <li>在备注中记录文件来源、用途等信息</li>
  </ul>

  <h2>二、分享功能进阶</h2>

  <h3>1. 分享链接设置技巧</h3>
  <table>
    <tr>
      <th>场景</th>
      <th>推荐设置</th>
      <th>注意事项</th>
    </tr>
    <tr>
      <td>临时分享</td>
      <td>有效期：7天<br/>提取码：自动生成</td>
      <td>及时关闭过期链接</td>
    </tr>
    <tr>
      <td>长期分享</td>
      <td>有效期：永久<br/>提取码：自定义（易记）</td>
      <td>定期检查链接有效性</td>
    </tr>
    <tr>
      <td>敏感文件</td>
      <td>仅特定人可访问<br/>设置访问密码</td>
      <td>避免公开分享</td>
    </tr>
  </table>

  <h3>2. 批量分享优化</h3>
  <p><strong>操作步骤</strong>：</p>
  <ol>
    <li>先将要分享的文件放入同一文件夹</li>
    <li>分享整个文件夹而不是单个文件</li>
    <li>在分享备注中说明文件内容和用途</li>
    <li>为不同用途创建不同的分享文件夹</li>
  </ol>

  <h3>3. 分享管理技巧</h3>
  <ul>
    <li><strong>定期清理</strong>：每月检查一次分享链接，关闭不需要的</li>
    <li><strong>分类管理</strong>：为不同用途的分享创建专门的文件夹</li>
    <li><strong>访问统计</strong>：利用网盘的访问统计功能了解文件被下载情况</li>
  </ul>

  <h2>三、上传下载优化</h2>

  <h3>1. 上传速度优化</h3>
  <div class="highlight">
    ⚡ 实测技巧：合理设置上传参数可提升30-50%的速度
  </div>

  <p><strong>具体方法</strong>：</p>
  <ul>
    <li><strong>分批上传</strong>：大文件分成多个小文件上传，避免单个失败影响全部</li>
    <li><strong>避开高峰</strong>：选择凌晨或工作日上午上传，避开网络高峰</li>
    <li><strong>压缩处理</strong>：多个小文件先压缩成zip再上传，减少传输开销</li>
    <li><strong>断点续传</strong>：使用支持断点续传的客户端，避免重复上传</li>
  </ul>

  <h3>2. 下载加速技巧</h3>
  <p><strong>免费用户</strong>：</p>
  <ul>
    <li>使用官方客户端而非网页版</li>
    <li>关闭其他占用带宽的程序</li>
    <li>选择合适的下载时间段</li>
    <li>使用下载工具的"慢速稳定"模式</li>
  </ul>

  <p><strong>付费用户</strong>：</p>
  <ul>
    <li>开启"极速下载"模式</li>
    <li>使用多线程下载功能</li>
    <li>设置合理的同时下载任务数（3-5个为佳）</li>
  </ul>

  <h2>四、同步与备份策略</h2>

  <h3>1. 智能同步设置</h3>
  <div class="warning">
    ⚠️ 重要提醒：不要盲目同步所有文件，选择性同步可以节省大量空间和带宽
  </div>

  <p><strong>推荐设置</strong>：</p>
  <ul>
    <li><strong>工作文档</strong>：实时同步，确保最新版本</li>
    <li><strong>照片视频</strong>：WiFi环境下自动同步</li>
    <li><strong>大文件备份</strong>：手动同步，避免占用带宽</li>
    <li><strong>临时文件</strong>：不同步，保持本地即可</li>
  </ul>

  <h3>2. 版本控制技巧</h3>
  <ul>
    <li><strong>历史版本</strong>：重要文件开启历史版本功能，可恢复到任意版本</li>
    <li><strong>版本命名</strong>：在文件名中体现版本号，如"报告_v1.0"、"报告_v2.0"</li>
    <li><strong>里程碑备份</strong>：项目关键节点创建专门的备份文件夹</li>
  </ul>

  <h3>3. 多设备同步策略</h3>
  <table>
    <tr>
      <th>设备类型</th>
      <th>同步策略</th>
      <th>注意事项</th>
    </tr>
    <tr>
      <td>主力电脑</td>
      <td>全量同步</td>
      <td>确保有足够的本地存储空间</td>
    </tr>
    <tr>
      <td>笔记本电脑</td>
      <td>选择性同步（仅工作文件）</td>
      <td>节省SSD空间，提高响应速度</td>
    </tr>
    <tr>
      <td>手机平板</td>
      <td>仅同步常用文件</td>
      <td>使用在线预览，避免大量下载</td>
    </tr>
  </table>

  <h2>五、搜索与整理技巧</h2>

  <h3>1. 高效搜索方法</h3>
  <p><strong>关键词技巧</strong>：</p>
  <ul>
    <li><strong>文件类型</strong>：type:pdf、type:doc、type:jpg</li>
    <li><strong>时间范围</strong>：date:2025、date:2025-09</li>
    <li><strong>文件大小</strong>：size:>100M、size:<1M</li>
    <li><strong>组合搜索</strong>：工作 type:pdf date:2025</li>
  </ul>

  <h3>2. 智能分类技巧</h3>
  <div class="highlight">
    🎯 利用AI分类功能，让网盘自动帮你整理文件
  </div>

  <ul>
    <li><strong>照片分类</strong>：开启人脸识别和场景识别，自动分类照片</li>
    <li><strong>文档分类</strong>：利用文档内容识别，自动归类相似文档</li>
    <li><strong>重复文件清理</strong>：定期使用重复文件检测功能，释放存储空间</li>
  </ul>

  <h2>六、安全与隐私保护</h2>

  <h3>1. 账号安全设置</h3>
  <ul>
    <li><strong>双重验证</strong>：开启手机短信或身份验证器二次验证</li>
    <li><strong>登录提醒</strong>：开启新设备登录提醒，及时发现异常</li>
    <li><strong>定期改密</strong>：每3-6个月更换一次密码</li>
    <li><strong>设备管理</strong>：定期检查登录设备，移除不认识的设备</li>
  </ul>

  <h3>2. 敏感文件保护</h3>
  <p><strong>加密策略</strong>：</p>
  <ul>
    <li><strong>本地加密</strong>：使用7-Zip、WinRAR等工具先加密再上传</li>
    <li><strong>分级管理</strong>：绝密文件本地存储，机密文件加密上传，一般文件直接上传</li>
    <li><strong>分享加密</strong>：分享敏感文件时务必设置提取码和有效期</li>
  </ul>

  <h2>七、高级技巧与隐藏功能</h2>

  <h3>1. 网盘隐藏功能</h3>
  <div class="tip">
    💡 这些功能很多人不知道，但非常实用！
  </div>

  <ul>
    <li><strong>离线下载</strong>：输入BT种子或磁力链接，让网盘服务器帮你下载</li>
    <li><strong>在线解压</strong>：无需下载，直接在线查看压缩包内容</li>
    <li><strong>文档预览</strong>：在线查看Office文档、PDF、图片、视频等</li>
    <li><strong>批量操作</strong>：批量重命名、批量移动、批量删除</li>
  </ul>

  <h3>2. 自动化技巧</h3>
  <ul>
    <li><strong>自动备份</strong>：设置手机照片自动备份到网盘</li>
    <li><strong>定时同步</strong>：设置特定时间自动同步指定文件夹</li>
    <li><strong>规则同步</strong>：根据文件类型、大小等条件自动同步</li>
  </ul>

  <div class="highlight">
    🚀 站长总结：掌握这些技巧，你的网盘使用效率至少提升200%！建议收藏本文，定期回顾实践。
  </div>
</div>`
  }
];

/**
 * 获取所有文章列表（不包含完整内容）
 */
export function getPostList() {
  return posts.map(post => ({
    id: post.id,
    title: post.title,
    excerpt: post.excerpt,
    author: post.author,
    publishDate: post.publishDate,
    slug: post.slug
  }));
}

/**
 * 根据ID获取单篇文章
 */
export function getPostById(id: number): Post | null {
  return posts.find(post => post.id === id) || null;
}

/**
 * 根据slug获取单篇文章
 */
export function getPostBySlug(slug: string): Post | null {
  return posts.find(post => post.slug === slug) || null;
}

/**
 * 获取下一篇文章
 */
export function getNextPost(currentId: number): Post | null {
  const nextPost = posts.find(post => post.id === currentId + 1);
  return nextPost || null;
}