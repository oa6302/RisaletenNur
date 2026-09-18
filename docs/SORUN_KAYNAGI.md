# "Yapay Zeka ile Oluştur" Butonunun Hata Kaynağı

## Hata Mesajı
`A "use server" file can only export async functions, found object.`

(Anlamı: Bir "'use server'" dosyası yalnızca `async` fonksiyonlar dışarı aktarabilir, ancak bir "obje" bulundu.)

---

## Sorunun Özeti

Next.js'in sunucu koduyla ilgili çok net ve katı bir kuralı vardır. Bir dosyanın en başına `'use server';` yazdığınızda, o dosyayı istemciden (tarayıcıdan) sunucuya açılan özel bir "eylem kapısı" olarak işaretlemiş olursunuz. Next.js, güvenlik ve öngörülebilirlik amacıyla, bu özel kapılardan dışarıya yalnızca **çağrılabilir eylemlerin**, yani `async` ile başlayan fonksiyonların çıkmasına izin verir.

Değişkenler, nesneler (objeler), sınıflar veya `async` olmayan fonksiyonlar gibi diğer JavaScript değerleri bu kapılardan dışarı aktarılamaz.

---

## Kök Neden ve Etkileşim Zinciri

1.  **Yanlış Kimlik Beyanı:** Hatanın asıl kaynağı `src/firebase/server-config.ts` dosyasıydı. Bu dosya, hem `'use server';` yönergesiyle bir "eylem kapısı" olarak işaretlenmişti hem de dışarıya `firestore` ve `storage` adında iki "obje" ihraç etmeye çalışıyordu. Bu, kuralın doğrudan ihlaliydi.

2.  **Etkileşim Zinciri:**
    - "Yapay Zeka ile Oluştur" butonuna bastığınızda, `'use server'` ile doğru bir şekilde işaretlenmiş olan `src/app/admin/actions.ts` dosyası tetiklenir.
    - `actions.ts` dosyası, veritabanına veri yazmak veya depolama alanını kullanmak için `src/firebase/server-config.ts` dosyasından `firestore` ve `storage` objelerini `import` etmeye (içeri aktarmaya) çalışır.
    - Bu noktada Next.js devreye girer ve "Dur bakalım, `actions.ts` dosyası, başka bir 'eylem kapısı' olan `server-config.ts` dosyasından bir 'obje' almaya çalışıyor. Bu kural dışı!" diyerek hatayı fırlatır.

---

## Çözüm

`src/firebase/server-config.ts` dosyasının görevi, tarayıcıdan doğrudan çağrılan bir "eylem kapısı" olmak değildir. Onun görevi, **sadece diğer sunucu dosyaları tarafından kullanılacak** olan `firestore` ve `storage` gibi yardımcı araçları hazırlamaktır. Yani o bir "yardımcı modül"dür.

Doğru çözüm, bu dosyanın kimliğini düzeltmektir:

- **`src/firebase/server-config.ts` dosyasının başındaki `'use server';` yönergesi kaldırıldı.**

Bu değişiklik, Next.js'e bu dosyanın bir "eylem kapısı" olmadığını, sadece sunucu tarafında kullanılan normal bir modül olduğunu bildirir. Böylece, dosyanın `firestore` ve `storage` objelerini, onlara ihtiyaç duyan `actions.ts` gibi diğer sunucu dosyalarına sorunsuzca ihraç etmesine izin verilir ve hata ortadan kalkar.
