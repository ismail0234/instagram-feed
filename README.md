# Instagram Feed
İnstagram hesabınızdaki gönderileri websitenizde yayınlamak için kullanılan küçük bir javascript kütüphanesidir. Bu kütüphane herhangi bir bağımlılık gerektirmez. İsteğe bağlı çoklu instagram hesaplarının gönderilerini listelemek için kullanabilirsiniz.


## Kullanım
İlk olarak indirdiğiniz kütüphaneyi web sayfanıza dahil edin. Daha sonra html yapılandırmanızı ayarlayın Resimlerin  bunu yapmak çok basit! 

#### HTML Yapılandırması
* **#instagram-container**: En genel kapsayıcınızın id'sinin bu olmasına dikkat edin. 
* **.instagram-item**: Resminizi kapsayacak div elemanınızın class'ının bu olmasına dikkat edin.  
* **.instagram-url**: Resminizi kapsayacak link elemanınızın class'ının bu olmasına dikkat edin.  
* **.instagram-image**: En son katmandaki yani resminizin class'ının bu olmasına dikkat edin.  

**Önemli Not:** Eklediğiniz her **.instagram-item** elementi bir instagram resmine denk gelmektedir ve eklediğiniz kadar otomatik olarak resimleri eleman sayısına göre ayarlayacaktır.

```html
<div id="instagram-container">
    <div class="instagram-item">
        <a href="#" target="_blank" class="instagram-url">
            <img loading="lazy" data-size="small" class="instagram-image img-fluid">
        </a>
    </div>
    <div class="instagram-item">
        <a href="#" target="_blank" class="instagram-url">
            <img loading="lazy" data-size="small" class="instagram-image img-fluid">
        </a>
    </div>
    <div class="instagram-item">
        <a href="#" target="_blank" class="instagram-url">
            <img loading="lazy" data-size="small" class="instagram-image img-fluid">
        </a>
    </div>
</div>
```
